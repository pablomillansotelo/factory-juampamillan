'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ProductionOrder as ProductionOrderType, type InternalItem } from '@/lib/api';
import { ProductionOrder as ProductionOrderRow } from './production-order-row';
import { TableCell } from '@/components/ui/table';

interface ProductionOrdersTableProps {
  productionOrders: ProductionOrderType[];
  internalItems: InternalItem[];
  onRefresh: () => void;
}

export function ProductionOrdersTable({
  productionOrders,
  internalItems,
  onRefresh,
}: ProductionOrdersTableProps) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vendor Order ID</TableHead>
              <TableHead>Item Interno</TableHead>
              <TableHead className="hidden md:table-cell">Cantidad</TableHead>
              <TableHead className="hidden md:table-cell">Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha Est.</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No se encontraron órdenes de producción
                </TableCell>
              </TableRow>
            ) : (
              productionOrders.map((order) => (
                <ProductionOrderRow
                  key={order.id}
                  productionOrder={order}
                  internalItems={internalItems}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

