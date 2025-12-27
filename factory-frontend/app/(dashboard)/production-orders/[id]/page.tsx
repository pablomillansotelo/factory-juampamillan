import { productionOrdersApi, internalItemsApi, type ProductionOrder, type InternalItem } from '@/lib/api-server';
import { ProductionOrderDetailPageClient } from './production-order-detail-page-client';

export const dynamic = 'force-dynamic';

export default async function ProductionOrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  let productionOrder: ProductionOrder | null = null;
  let internalItems: InternalItem[] = [];

  try {
    const [order, items] = await Promise.all([
      productionOrdersApi.getById(id).catch(() => null),
      internalItemsApi.getAll({ limit: 1000 }).catch(() => ({ internalItems: [], total: 0, offset: null })),
    ]);
    productionOrder = order;
    internalItems = items.internalItems;
  } catch (error) {
    console.error('Error fetching production order:', error);
  }

  if (!productionOrder) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-muted-foreground">Orden de producción no encontrada</p>
      </div>
    );
  }

  return <ProductionOrderDetailPageClient productionOrder={productionOrder} internalItems={internalItems} />;
}

