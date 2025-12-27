'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ProductionOrder as ProductionOrderType, type InternalItem } from '@/lib/api';
import Link from 'next/link';

interface ProductionOrderProps {
  productionOrder: ProductionOrderType;
  internalItems: InternalItem[];
  onRefresh: () => void;
}

export function ProductionOrder({ productionOrder, internalItems, onRefresh }: ProductionOrderProps) {
  const getInternalItemName = (id: number) => {
    const item = internalItems.find(i => i.id === id);
    return item ? `${item.sku} - ${item.name}` : `Item ${id}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 capitalize">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 capitalize">Aprobada</Badge>;
      case 'in_production':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 capitalize">En Producción</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 capitalize">Cancelada</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority <= 1) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Alta</Badge>;
    } else if (priority <= 2) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Media-Alta</Badge>;
    } else if (priority <= 3) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Media</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Baja</Badge>;
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{productionOrder.id}</TableCell>
      <TableCell>{productionOrder.vendorOrderId}</TableCell>
      <TableCell>{getInternalItemName(productionOrder.internalItemId)}</TableCell>
      <TableCell className="hidden md:table-cell">{productionOrder.quantity}</TableCell>
      <TableCell className="hidden md:table-cell">
        {getPriorityBadge(productionOrder.priority)}
      </TableCell>
      <TableCell>
        {getStatusBadge(productionOrder.status)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(productionOrder.estimatedCompletionDate)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Menú de acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/production-orders/${productionOrder.id}`}>Ver Detalle</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

