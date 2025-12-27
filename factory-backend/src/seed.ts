/**
 * Seed de datos para Factory Backend
 * Ejecutar con: bun run src/seed.ts
 *
 * Este backend es la fuente de verdad para:
 * - Items internos (internal_items) - productos que se fabrican
 * - Atributos de items (item_attributes)
 * - Disponibilidad de producción (item_availability)
 * - BOM (Bill of Materials) - componentes necesarios para fabricar
 * - Órdenes de producción (production_orders)
 *
 * Nota: Los usuarios/RBAC viven en Permit. Los productos externos se gestionan en Inventory.
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

const sqlClient = neon(process.env.DATABASE_URL!)
const db = drizzle(sqlClient, { schema })

async function seed() {
  console.log('🌱 Iniciando seed de Factory...')

  try {
    // 1. Crear items internos (productos que se fabrican)
    console.log('🏭 Creando items internos...')
    const internalItems = await db
      .insert(schema.internalItems)
      .values([
        {
          sku: 'INT-ITEM-001',
          name: 'Hoja de Papel A4',
          description: 'Hoja de papel tamaño A4, 80g/m²',
          status: 'active',
        },
        {
          sku: 'INT-ITEM-002',
          name: 'Resma de Papel A4',
          description: 'Resma de 500 hojas de papel A4, 80g/m²',
          status: 'active',
        },
        {
          sku: 'INT-ITEM-003',
          name: 'Caja de Resmas',
          description: 'Caja con 10 resmas de papel A4',
          status: 'active',
        },
        {
          sku: 'INT-ITEM-004',
          name: 'Cartón Corrugado',
          description: 'Cartón corrugado para empaque, 200x150x100 cm',
          status: 'active',
        },
        {
          sku: 'INT-ITEM-005',
          name: 'Tinta Negra',
          description: 'Tinta negra para impresión, 1 litro',
          status: 'active',
        },
        {
          sku: 'INT-ITEM-006',
          name: 'Tinta Color',
          description: 'Tinta a color para impresión, 1 litro',
          status: 'inactive',
        },
      ])
      .onConflictDoNothing()
      .returning()

    console.log(`✅ ${internalItems.length} items internos creados/verificados`)

    // 2. Crear atributos para algunos items
    console.log('📋 Creando atributos de items...')
    const attributes = []
    
    for (const item of internalItems) {
      if (item.sku === 'INT-ITEM-001') {
        attributes.push(
          { internalItemId: item.id, key: 'dimensiones', value: '210x297 mm' },
          { internalItemId: item.id, key: 'gramaje', value: '80 g/m²' },
          { internalItemId: item.id, key: 'color', value: 'Blanco' },
        )
      } else if (item.sku === 'INT-ITEM-002') {
        attributes.push(
          { internalItemId: item.id, key: 'cantidad_hojas', value: '500' },
          { internalItemId: item.id, key: 'dimensiones', value: '210x297 mm' },
          { internalItemId: item.id, key: 'gramaje', value: '80 g/m²' },
        )
      } else if (item.sku === 'INT-ITEM-003') {
        attributes.push(
          { internalItemId: item.id, key: 'cantidad_resmas', value: '10' },
          { internalItemId: item.id, key: 'peso_total', value: '25 kg' },
        )
      } else if (item.sku === 'INT-ITEM-004') {
        attributes.push(
          { internalItemId: item.id, key: 'dimensiones', value: '200x150x100 cm' },
          { internalItemId: item.id, key: 'resistencia', value: 'Alta' },
        )
      } else if (item.sku === 'INT-ITEM-005' || item.sku === 'INT-ITEM-006') {
        attributes.push(
          { internalItemId: item.id, key: 'volumen', value: '1 litro' },
          { internalItemId: item.id, key: 'tipo', value: item.sku === 'INT-ITEM-005' ? 'Negra' : 'Color' },
        )
      }
    }

    if (attributes.length > 0) {
      await db
        .insert(schema.itemAttributes)
        .values(attributes)
        .onConflictDoNothing()
      
      console.log(`✅ ${attributes.length} atributos creados/verificados`)
    }

    // 3. Crear disponibilidad de producción
    console.log('📊 Creando disponibilidad de producción...')
    const availability = []
    
    for (const item of internalItems.slice(0, 4)) { // Solo para los primeros 4 items activos
      availability.push({
        internalItemId: item.id,
        status: item.id % 2 === 0 ? 'in_production' : 'planned',
        note: item.id % 2 === 0 
          ? 'En producción actualmente' 
          : 'Planificado para próxima semana',
      })
    }

    if (availability.length > 0) {
      await db
        .insert(schema.itemAvailability)
        .values(availability)
        .onConflictDoNothing()
      
      console.log(`✅ ${availability.length} registros de disponibilidad creados/verificados`)
    }

    // 4. Crear BOM (Bill of Materials) - componentes necesarios
    console.log('📦 Creando BOM (Bill of Materials)...')
    const boms = []
    
    // Resma necesita 500 hojas
    const resmaItem = internalItems.find(i => i.sku === 'INT-ITEM-002')
    const hojaItem = internalItems.find(i => i.sku === 'INT-ITEM-001')
    if (resmaItem && hojaItem) {
      boms.push({
        internalItemId: resmaItem.id,
        component: 'Hoja de Papel A4',
        quantity: '500',
        unit: 'hojas',
      })
    }

    // Caja de resmas necesita 10 resmas
    const cajaItem = internalItems.find(i => i.sku === 'INT-ITEM-003')
    if (cajaItem && resmaItem) {
      boms.push({
        internalItemId: cajaItem.id,
        component: 'Resma de Papel A4',
        quantity: '10',
        unit: 'resmas',
      })
      // También necesita cartón para la caja
      const cartonItem = internalItems.find(i => i.sku === 'INT-ITEM-004')
      if (cartonItem) {
        boms.push({
          internalItemId: cajaItem.id,
          component: 'Cartón Corrugado',
          quantity: '1',
          unit: 'cajas',
        })
      }
    }

    if (boms.length > 0) {
      await db
        .insert(schema.itemBoms)
        .values(boms)
        .onConflictDoNothing()
      
      console.log(`✅ ${boms.length} entradas de BOM creadas/verificadas`)
    }

    // 5. Crear órdenes de producción de ejemplo
    console.log('📋 Creando órdenes de producción...')
    const productionOrders = []
    
    // Crear algunas órdenes de ejemplo (simulando que vienen de Vendor)
    for (let i = 0; i < 3; i++) {
      const item = internalItems[i]
      if (item) {
        productionOrders.push({
          vendorOrderId: 100 + i, // IDs simulados de órdenes de Vendor
          internalItemId: item.id,
          quantity: (i + 1) * 100,
          priority: i === 0 ? 1 : 3, // Primera orden alta prioridad
          status: i === 0 ? 'in_production' : 'pending',
          notes: `Orden de producción para ${item.name}`,
          estimatedCompletionDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // +7, +14, +21 días
        })
      }
    }

    if (productionOrders.length > 0) {
      await db
        .insert(schema.productionOrders)
        .values(productionOrders)
        .onConflictDoNothing()
      
      console.log(`✅ ${productionOrders.length} órdenes de producción creadas/verificadas`)
    }

    console.log('✅ Seed completado exitosamente')
    console.log('\n📋 Resumen:')
    console.log(`   - Items internos: ${internalItems.length}`)
    console.log(`   - Atributos: ${attributes.length}`)
    console.log(`   - Disponibilidad: ${availability.length}`)
    console.log(`   - Entradas BOM: ${boms.length}`)
    console.log(`   - Órdenes de producción: ${productionOrders.length}`)
  } catch (error: any) {
    console.error('❌ Error en seed:', error)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

seed()

