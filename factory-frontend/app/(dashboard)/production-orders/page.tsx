import { productionOrdersApi, type ProductionOrder } from '@/lib/api-server';
import { ProductionOrdersPageClient } from './production-orders-page-client';

export const dynamic = 'force-dynamic';

export default async function ProductionOrdersPage(props: {
  searchParams?: Promise<{ vendorOrderId?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const vendorOrderId = searchParams?.vendorOrderId ? Number(searchParams.vendorOrderId) : undefined;
  const status = searchParams?.status as 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled' | undefined;

  let productionOrders: ProductionOrder[] = [];
  
  try {
    productionOrders = await productionOrdersApi.getAll({
      vendorOrderId,
      status,
    });
  } catch (error) {
    console.error('Error fetching production orders:', error);
  }

  return (
    <ProductionOrdersPageClient
      initialProductionOrders={productionOrders}
      initialVendorOrderId={vendorOrderId}
      initialStatus={status}
    />
  );
}

