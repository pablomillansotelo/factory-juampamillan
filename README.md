# Factory Juampamillan (Manufactura / Catálogo interno)

Este repo será el módulo **Factory** del ERP modular.

## Propósito

Factory es el **source of truth** del **catálogo interno** de manufactura:
- internal items (materiales/productos internos)
- atributos y propiedades de manufactura
- IDs estables para mapping hacia Inventory

## No incluye
- Catálogo externo de venta y precios base (Inventory)
- Órdenes de venta (Vendor)
- Embarques y tracking (Shipments)
- Usuarios/RBAC/auditoría/notificaciones (Permit)

## Integraciones

- Inventory consulta Factory:
  - `GET /v1/internal-items`
  - `GET /v1/internal-items/:internalItemId`

## Roadmap / Backlog (alto nivel)

### Must (MVP)
- `factory-backend` (Elysia + Drizzle):
  - internal_items
  - internal_item_attributes (o JSONB)
- Endpoints read-only para Inventory
- API keys + rate limiting

### Should
- Modelo de BOM/rutas (si el negocio lo requiere)
- Versionado y trazabilidad de cambios (audit en Permit)

### Could
- Integración con planeación/producción (futuro)


