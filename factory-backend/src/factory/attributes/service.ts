import { db } from '../../db.js'
import { itemAttributes } from './schema.js'
import { eq } from 'drizzle-orm'
import { emitPermitAuditLog } from '../../audit/permit-client.js'
import { InternalItemsService } from '../internal-items/service.js'

export interface CreateAttributeInput {
  internalItemId: number
  key: string
  value: string
}

export interface UpdateAttributeInput {
  key?: string
  value?: string
}

export class ItemAttributesService {
  static async listByItem(internalItemId: number) {
    const rows = await db.select().from(itemAttributes).where(eq(itemAttributes.internalItemId, internalItemId))
    return rows
  }

  static async create(data: CreateAttributeInput) {
    await InternalItemsService.getById(data.internalItemId) // valida existencia
    const [inserted] = await db
      .insert(itemAttributes)
      .values({
        internalItemId: data.internalItemId,
        key: data.key,
        value: data.value,
        updatedAt: new Date(),
      })
      .returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'create',
      entityType: 'item_attributes',
      entityId: inserted.id,
      changes: { after: inserted },
      metadata: { source: 'factory-backend' },
    })

    return inserted
  }

  static async update(id: number, data: UpdateAttributeInput) {
    const [before] = await db.select().from(itemAttributes).where(eq(itemAttributes.id, id))
    if (!before) throw new Error('Atributo no encontrado')

    const updateData: any = { updatedAt: new Date() }
    if (data.key !== undefined) updateData.key = data.key
    if (data.value !== undefined) updateData.value = data.value

    const [updated] = await db.update(itemAttributes).set(updateData).where(eq(itemAttributes.id, id)).returning()
    if (!updated) throw new Error('No se pudo actualizar atributo')

    await emitPermitAuditLog({
      userId: null,
      action: 'update',
      entityType: 'item_attributes',
      entityId: id,
      changes: { before, after: updated },
      metadata: { source: 'factory-backend' },
    })

    return updated
  }

  static async remove(id: number) {
    const [before] = await db.select().from(itemAttributes).where(eq(itemAttributes.id, id))
    if (!before) throw new Error('Atributo no encontrado')

    const [deleted] = await db.delete(itemAttributes).where(eq(itemAttributes.id, id)).returning()

    await emitPermitAuditLog({
      userId: null,
      action: 'delete',
      entityType: 'item_attributes',
      entityId: id,
      changes: { before },
      metadata: { source: 'factory-backend' },
    })

    return deleted
  }
}

