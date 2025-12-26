import { db } from '../../db.js'
import { internalItems, internalItemStatusEnum } from './schema.js'
import { and, eq, like, or, sql } from 'drizzle-orm'
import { emitPermitAuditLog } from '../../audit/permit-client.js'

export type InternalItemStatus = (typeof internalItemStatusEnum.enumValues)[number]

export interface InternalItemFilters {
  status?: InternalItemStatus
  search?: string
  offset?: number
  limit?: number
}

export interface CreateInternalItemInput {
  sku: string
  name: string
  description?: string | null
  status?: InternalItemStatus
}

export interface UpdateInternalItemInput extends Partial<CreateInternalItemInput> {}

export class InternalItemsService {
  static async list(filters?: InternalItemFilters) {
    let query = db.select().from(internalItems)
    const conditions: any[] = []

    if (filters?.status) conditions.push(eq(internalItems.status, filters.status))
    if (filters?.search) {
      conditions.push(or(like(internalItems.name, `%${filters.search}%`), like(internalItems.sku, `%${filters.search}%`))!)
    }

    if (conditions.length) query = query.where(and(...conditions)) as any

    const countQuery =
      conditions.length > 0
        ? db.select({ count: sql<number>`count(*)` }).from(internalItems).where(and(...conditions))
        : db.select({ count: sql<number>`count(*)` }).from(internalItems)
    const [countResult] = await countQuery
    const total = Number(countResult?.count || 0)

    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) query = query.offset(filters.offset)

    const rows = await query
    return { internalItems: rows, total, offset: filters?.offset || null }
  }

  static async getById(id: number) {
    const [row] = await db.select().from(internalItems).where(eq(internalItems.id, id))
    if (!row) throw new Error(`Internal item ${id} no encontrado`)
    return row
  }

  static async create(data: CreateInternalItemInput) {
    const [inserted] = await db
      .insert(internalItems)
      .values({
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        status: data.status || 'active',
        updatedAt: new Date(),
      })
      .returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'create',
      entityType: 'internal_items',
      entityId: inserted.id,
      changes: { after: inserted },
      metadata: { source: 'factory-backend' },
    })

    return inserted
  }

  static async update(id: number, data: UpdateInternalItemInput) {
    const before = await this.getById(id)
    const updateData: any = { updatedAt: new Date() }
    if (data.sku !== undefined) updateData.sku = data.sku
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status

    const [updated] = await db.update(internalItems).set(updateData).where(eq(internalItems.id, id)).returning()
    if (!updated) throw new Error('No se pudo actualizar internal item')

    await emitPermitAuditLog({
      userId: null,
      action: 'update',
      entityType: 'internal_items',
      entityId: id,
      changes: { before, after: updated },
      metadata: { source: 'factory-backend' },
    })

    return updated
  }

  static async remove(id: number) {
    const before = await this.getById(id)
    const [deleted] = await db.delete(internalItems).where(eq(internalItems.id, id)).returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'delete',
      entityType: 'internal_items',
      entityId: id,
      changes: { before },
      metadata: { source: 'factory-backend' },
    })

    return deleted
  }
}

