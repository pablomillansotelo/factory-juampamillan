'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductionOrder, productionOrdersApi, type InternalItem } from '@/lib/api';
import { ProductionOrderStatusDialog } from '../production-order-status-dialog';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductionOrderDetailPageClientProps {
  productionOrder: ProductionOrder;
  internalItems: InternalItem[];
}

export function ProductionOrderDetailPageClient({
  productionOrder,
  internalItems,
}: ProductionOrderDetailPageClientProps) {
  const router = useRouter();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(productionOrder);

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = async (updatedOrder: ProductionOrder) => {
    setCurrentOrder(updatedOrder);
    router.refresh();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/production-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Orden de Producción #{currentOrder.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-medium">{currentOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendor Order ID</p>
                <p className="font-medium">{currentOrder.vendorOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Item Interno</p>
                <p className="font-medium">{getInternalItemName(currentOrder.internalItemId)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cantidad</p>
                <p className="font-medium">{currentOrder.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prioridad</p>
                <div className="mt-1">{getPriorityBadge(currentOrder.priority)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <div className="mt-1">{getStatusBadge(currentOrder.status)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Estimada</p>
                <p className="font-medium">{formatDate(currentOrder.estimatedCompletionDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creada</p>
                <p className="font-medium">{formatDate(currentOrder.createdAt)}</p>
              </div>
            </div>
            {currentOrder.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notas</p>
                <p className="text-sm bg-muted p-3 rounded-md">{currentOrder.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>Gestiona el estado de la orden de producción</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowStatusDialog(true)} className="w-full">
              Actualizar Estado
            </Button>
          </CardContent>
        </Card>
      </div>

      <ProductionOrderStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        productionOrder={currentOrder}
        onSuccess={handleStatusUpdate}
      />
    </div>
  );
}

