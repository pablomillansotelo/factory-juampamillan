import { pgTable, serial, integer, text, timestamp, pgEnum, numeric } from "drizzle-orm/pg-core";

/**
 * Estado de una orden de producción
 */
export const productionOrderStatusEnum = pgEnum('production_order_status', [
  'pending',
  'approved',
  'in_production',
  'completed',
  'cancelled',
]);

/**
 * Schema de órdenes de producción
 * Se crean desde Vendor cuando no hay stock suficiente
 */
export const productionOrders = pgTable("production_orders", {
  id: serial("id").primaryKey(),
  // Referencia a Vendor orders.id (sin FK porque es otro servicio)
  vendorOrderId: integer("vendor_order_id").notNull(),
  // Referencia a internal_items.id
  internalItemId: integer("internal_item_id").notNull(),
  // Cantidad a producir
  quantity: integer("quantity").notNull(),
  // Prioridad (1 = alta, 5 = baja)
  priority: integer("priority").notNull().default(3),
  status: productionOrderStatusEnum("status").notNull().default("pending"),
  // Notas/razón de la orden
  notes: text("notes"),
  // Fecha estimada de entrega
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

