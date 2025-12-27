import { db } from '../../db.js'
import { itemAvailability, availabilityStatusEnum } from './schema.js'
import { InternalItemsService } from '../internal-items/service.js'
import { and, eq, sql } from 'drizzle-orm'
import { emitPermitAuditLog } from '../../audit/permit-client.js'

export type AvailabilityStatus = (typeof availabilityStatusEnum.enumValues)[number]

export interface AvailabilityFilters {
  internalItemId?: number
  status?: AvailabilityStatus
  offset?: number
  limit?: number
}

export interface CreateAvailabilityInput {
  internalItemId: number
  status?: AvailabilityStatus
  note?: string | null
}

export interface UpdateAvailabilityInput extends Partial<CreateAvailabilityInput> {}

export class AvailabilityService {
  static async list(filters?: AvailabilityFilters) {
    const conditions: any[] = []
    if (filters?.internalItemId) conditions.push(eq(itemAvailability.internalItemId, filters.internalItemId))
    if (filters?.status) conditions.push(eq(itemAvailability.status, filters.status))

    let query = db.select().from(itemAvailability)
    if (conditions.length) query = query.where(and(...conditions)) as any

    const countQuery =
      conditions.length > 0
        ? db.select({ count: sql<number>`count(*)` }).from(itemAvailability).where(and(...conditions))
        : db.select({ count: sql<number>`count(*)` }).from(itemAvailability)
    const [countResult] = await countQuery
    const total = Number(countResult?.count || 0)

    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) query = query.offset(filters.offset)

    const rows = await query
    return { availability: rows, total, offset: filters?.offset || null }
  }

  static async getById(id: number) {
    const [row] = await db.select().from(itemAvailability).where(eq(itemAvailability.id, id))
    if (!row) throw new Error('Disponibilidad no encontrada')
    return row
  }

  static async create(data: CreateAvailabilityInput) {
    await InternalItemsService.getById(data.internalItemId)
    const [inserted] = await db
      .insert(itemAvailability)
      .values({
        internalItemId: data.internalItemId,
        status: data.status || 'planned',
        note: data.note || null,
        updatedAt: new Date(),
      })
      .returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'create',
      entityType: 'item_availability',
      entityId: inserted.id,
      changes: { after: inserted },
      metadata: { source: 'factory-backend' },
    })

    return inserted
  }

  static async update(id: number, data: UpdateAvailabilityInput) {
    const before = await this.getById(id)
    const updateData: any = { updatedAt: new Date() }
    if (data.status !== undefined) updateData.status = data.status
    if (data.note !== undefined) updateData.note = data.note
    if (data.internalItemId !== undefined) updateData.internalItemId = data.internalItemId

    const [updated] = await db.update(itemAvailability).set(updateData).where(eq(itemAvailability.id, id)).returning()
    if (!updated) throw new Error('No se pudo actualizar disponibilidad')

    await emitPermitAuditLog({
      userId: null,
      action: 'update',
      entityType: 'item_availability',
      entityId: id,
      changes: { before, after: updated },
      metadata: { source: 'factory-backend' },
    })

    return updated
  }

  static async remove(id: number) {
    const before = await this.getById(id)
    const [deleted] = await db.delete(itemAvailability).where(eq(itemAvailability.id, id)).returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'delete',
      entityType: 'item_availability',
      entityId: id,
      changes: { before },
      metadata: { source: 'factory-backend' },
    })

    return deleted
  }
}


