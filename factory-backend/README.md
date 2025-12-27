# Factory Backend

Backend del módulo **Factory** (catálogo interno de manufactura).

## Alcance

### Incluye
- Catálogo interno (internal items)
- Atributos de manufactura (propiedades técnicas)
- Disponibilidad de producción (status simple)
- BOM/components (placeholder ligero)
- Endpoints de lectura para Inventory

### No incluye
- Precios base / SKUs vendibles (Inventory)
- Órdenes de venta (Vendor)
- Embarques (Shipments)
- Users/RBAC/notifications/audit (Permit)

## Roadmap (alto nivel)

### MVP
- Catálogo interno: `GET/POST/PUT/DELETE /v1/internal-items`
- Atributos: `GET/POST/PUT/DELETE /v1/attributes`
- Disponibilidad: `GET/POST/PUT/DELETE /v1/availability`
- BOM: `GET/POST/PUT/DELETE /v1/bom`
- API keys + rate limiting

### Integraciones
- Audit a Permit en fallos y mutaciones
- Validación de items al crear disponibilidad/BOM


