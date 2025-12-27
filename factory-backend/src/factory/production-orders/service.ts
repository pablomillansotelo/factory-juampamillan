import { db } from '../../db.js'
import { productionOrders } from './schema.js'
import { eq, desc, and } from 'drizzle-orm'
import { emitPermitAuditLog } from '../../audit/permit-client.js'

export type ProductionOrderStatus = 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled'

export interface CreateProductionOrderInput {
  vendorOrderId: number
  internalItemId: number
  quantity: number
  priority?: number
  notes?: string
  estimatedCompletionDate?: string | Date
}

export interface UpdateProductionOrderInput {
  status?: ProductionOrderStatus
  notes?: string
  estimatedCompletionDate?: string | Date
}

export class ProductionOrdersService {
  static async list(filters?: { vendorOrderId?: number; status?: ProductionOrderStatus }) {
    let query = db.select().from(productionOrders)
    const conditions: any[] = []

    if (filters?.vendorOrderId) {
      conditions.push(eq(productionOrders.vendorOrderId, filters.vendorOrderId))
    }
    if (filters?.status) {
      conditions.push(eq(productionOrders.status, filters.status))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    return await query.orderBy(desc(productionOrders.createdAt))
  }

  static async getById(id: number) {
    const rows = await db.select().from(productionOrders).where(eq(productionOrders.id, id))
    if (rows.length === 0) throw new Error(`Production order con ID ${id} no encontrado`)
    return rows[0]!
  }

  static async create(data: CreateProductionOrderInput) {
    const result = await db.insert(productionOrders).values({
      vendorOrderId: data.vendorOrderId,
      internalItemId: data.internalItemId,
      quantity: data.quantity,
      priority: data.priority || 3,
      status: 'pending' as any,
      notes: data.notes,
      estimatedCompletionDate: data.estimatedCompletionDate ? new Date(data.estimatedCompletionDate) : null,
      updatedAt: new Date(),
    }).returning()

    const order = result[0]!

    await emitPermitAuditLog({
      userId: null,
      action: 'create',
      entityType: 'production_orders',
      entityId: order.id,
      changes: { after: order },
      metadata: { 
        source: 'factory-backend',
        vendorOrderId: data.vendorOrderId,
        reason: 'Stock insuficiente en Inventory'
      },
    })

    return order
  }

  static async update(id: number, data: UpdateProductionOrderInput) {
    const before = await this.getById(id)
    
    const result = await db.update(productionOrders).set({
      status: data.status ? (data.status as any) : before.status,
      notes: data.notes !== undefined ? data.notes : before.notes,
      estimatedCompletionDate: data.estimatedCompletionDate ? new Date(data.estimatedCompletionDate) : before.estimatedCompletionDate,
      updatedAt: new Date(),
    }).where(eq(productionOrders.id, id)).returning()

    const updated = result[0]!

    await emitPermitAuditLog({
      userId: null,
      action: 'update',
      entityType: 'production_orders',
      entityId: id,
      changes: { before, after: updated },
      metadata: { source: 'factory-backend' },
    })

    return updated
  }
}

