export interface AuditLogEntry {
  userId: number | null
  action: 'create' | 'update' | 'delete'
  entityType: string
  entityId: number | string
  changes?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export async function emitPermitAuditLog(entry: AuditLogEntry) {
  const permitUrl = process.env.PERMIT_API_URL
  const permitApiKey = process.env.PERMIT_API_KEY

  if (!permitUrl || !permitApiKey) return

  try {
    await fetch(`${permitUrl}/v1/audit-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': permitApiKey,
      },
      body: JSON.stringify(entry),
    })
  } catch (error) {
    console.error('No se pudo enviar audit log a Permit', error)
  }
}

