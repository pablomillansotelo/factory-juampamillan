import { db } from '../../db.js'
import { itemBoms } from './schema.js'
import { InternalItemsService } from '../internal-items/service.js'
import { eq } from 'drizzle-orm'
import { emitPermitAuditLog } from '../../audit/permit-client.js'

export interface BomFilters {
  internalItemId?: number
}

export interface CreateBomInput {
  internalItemId: number
  component: string
  quantity?: string | number
  unit?: string | null
}

export interface UpdateBomInput extends Partial<CreateBomInput> {}

export class ItemBomsService {
  static async list(filters?: BomFilters) {
    let query = db.select().from(itemBoms)
    if (filters?.internalItemId) {
      query = query.where(eq(itemBoms.internalItemId, filters.internalItemId))
    }
    return query
  }

  static async create(data: CreateBomInput) {
    await InternalItemsService.getById(data.internalItemId)
    const [inserted] = await db
      .insert(itemBoms)
      .values({
        internalItemId: data.internalItemId,
        component: data.component,
        quantity: data.quantity !== undefined ? String(data.quantity) : '1',
        unit: data.unit || 'unit',
        updatedAt: new Date(),
      })
      .returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'create',
      entityType: 'item_boms',
      entityId: inserted.id,
      changes: { after: inserted },
      metadata: { source: 'factory-backend' },
    })

    return inserted
  }

  static async update(id: number, data: UpdateBomInput) {
    const [before] = await db.select().from(itemBoms).where(eq(itemBoms.id, id))
    if (!before) throw new Error('BOM no encontrado')

    const updateData: any = { updatedAt: new Date() }
    if (data.component !== undefined) updateData.component = data.component
    if (data.quantity !== undefined) updateData.quantity = String(data.quantity)
    if (data.unit !== undefined) updateData.unit = data.unit
    if (data.internalItemId !== undefined) updateData.internalItemId = data.internalItemId

    const [updated] = await db.update(itemBoms).set(updateData).where(eq(itemBoms.id, id)).returning()
    if (!updated) throw new Error('No se pudo actualizar BOM')

    await emitPermitAuditLog({
      userId: null,
      action: 'update',
      entityType: 'item_boms',
      entityId: id,
      changes: { before, after: updated },
      metadata: { source: 'factory-backend' },
    })

    return updated
  }

  static async remove(id: number) {
    const [before] = await db.select().from(itemBoms).where(eq(itemBoms.id, id))
    if (!before) throw new Error('BOM no encontrado')

    const [deleted] = await db.delete(itemBoms).where(eq(itemBoms.id, id)).returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'delete',
      entityType: 'item_boms',
      entityId: id,
      changes: { before },
      metadata: { source: 'factory-backend' },
    })

    return deleted
  }
}


