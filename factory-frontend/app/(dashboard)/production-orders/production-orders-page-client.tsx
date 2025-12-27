'use client';

import { useState } from 'react';
import { ProductionOrder, productionOrdersApi, internalItemsApi, type InternalItem } from '@/lib/api';
import { ProductionOrdersTable } from './production-orders-table';
import { TableSkeleton } from '@/components/table-skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

interface ProductionOrdersPageClientProps {
  initialProductionOrders: ProductionOrder[];
  initialVendorOrderId?: number;
  initialStatus?: 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled';
}

export function ProductionOrdersPageClient({
  initialProductionOrders,
  initialVendorOrderId,
  initialStatus,
}: ProductionOrdersPageClientProps) {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(initialProductionOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'all' | 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled'>(
    initialStatus || 'all'
  );
  const [vendorOrderIdFilter, setVendorOrderIdFilter] = useState<string>(initialVendorOrderId?.toString() || '');
  const [internalItems, setInternalItems] = useState<InternalItem[]>([]);

  useEffect(() => {
    const loadInternalItems = async () => {
      try {
        const result = await internalItemsApi.getAll({ limit: 1000 });
        setInternalItems(result.internalItems);
      } catch (error) {
        console.error('Error loading internal items:', error);
      }
    };
    loadInternalItems();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (currentStatus !== 'all') filters.status = currentStatus;
      if (vendorOrderIdFilter) filters.vendorOrderId = Number(vendorOrderIdFilter);
      
      const result = await productionOrdersApi.getAll(filters);
      setProductionOrders(result);
    } catch (error) {
      console.error('Error al actualizar órdenes de producción:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as 'all' | 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled';
    setCurrentStatus(newStatus);
    handleRefresh();
  };

  const handleVendorOrderIdChange = (value: string) => {
    setVendorOrderIdFilter(value);
    // Debounce: solo refrescar cuando el usuario termine de escribir
    const timeoutId = setTimeout(() => {
      handleRefresh();
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  if (isLoading) {
    return <TableSkeleton columns={7} rows={5} />;
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
        <Tabs defaultValue={currentStatus} value={currentStatus} onValueChange={handleStatusChange}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="approved">Aprobadas</TabsTrigger>
            <TabsTrigger value="in_production">En Producción</TabsTrigger>
            <TabsTrigger value="completed" className="hidden sm:flex">
              Completadas
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="hidden sm:flex">
              Canceladas
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <Label htmlFor="vendorOrderId" className="text-sm whitespace-nowrap">
              Vendor Order ID:
            </Label>
            <Input
              id="vendorOrderId"
              type="number"
              placeholder="Filtrar por orden..."
              value={vendorOrderIdFilter}
              onChange={(e) => {
                setVendorOrderIdFilter(e.target.value);
                const timeoutId = setTimeout(() => {
                  handleRefresh();
                }, 500);
                return () => clearTimeout(timeoutId);
              }}
              className="w-32"
            />
          </div>
        </div>
      </div>

      <ProductionOrdersTable
        productionOrders={productionOrders}
        internalItems={internalItems}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

