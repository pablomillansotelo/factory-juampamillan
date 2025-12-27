import { internalItemsApi, type InternalItem } from '@/lib/api-server';
import { InternalItemEditPageClient } from './internal-item-edit-page-client';

export const dynamic = 'force-dynamic';

export default async function EditInternalItemPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  const internalItem: InternalItem = await internalItemsApi.getById(id);

  return <InternalItemEditPageClient internalItem={internalItem} />;
}

