import { internalItemsApi, type InternalItem } from '@/lib/api-server';
import { InternalItemsPageClient } from './internal-items-page-client';

export const dynamic = 'force-dynamic';

export default async function InternalItemsPage(props: {
  searchParams?: Promise<{ q?: string; offset?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.q ?? '';
  const offset = searchParams?.offset ? Number(searchParams.offset) : 0;
  const status = searchParams?.status as 'active' | 'inactive' | 'archived' | undefined;

  let result = { internalItems: [] as InternalItem[], total: 0, offset: null as number | null };
  
  try {
    result = await internalItemsApi.getAll({
      search,
      offset,
      status,
      limit: 5,
    });
  } catch (error) {
    console.error('Error fetching internal items:', error);
  }

  return (
    <InternalItemsPageClient
      initialInternalItems={result.internalItems}
      initialTotal={result.total}
      initialOffset={result.offset}
      initialSearch={search}
      initialStatus={status}
    />
  );
}

