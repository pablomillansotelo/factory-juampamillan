# Factory Backend

Backend del módulo **Factory** (catálogo interno de manufactura).

## Alcance

### Incluye
- Catálogo interno (internal items)
- Atributos de manufactura (propiedades técnicas)
- Endpoints de lectura para Inventory

### No incluye
- Precios base / SKUs vendibles (Inventory)
- Órdenes de venta (Vendor)
- Embarques (Shipments)
- Users/RBAC/notifications/audit (Permit)

## Roadmap (alto nivel)

### MVP
- `GET /v1/internal-items`
- `GET /v1/internal-items/:internalItemId`
- API keys + rate limiting


