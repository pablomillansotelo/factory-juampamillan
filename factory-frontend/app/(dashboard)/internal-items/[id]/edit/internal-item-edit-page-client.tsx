'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InternalItemForm } from '../../internal-item-form';
import type { InternalItem } from '@/lib/api';

export function InternalItemEditPageClient({ internalItem }: { internalItem: InternalItem }) {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar item interno</CardTitle>
          <CardDescription>Actualiza la información del item interno.</CardDescription>
        </CardHeader>
        <CardContent>
          <InternalItemForm
            internalItem={internalItem}
            onCancel={() => router.push('/internal-items')}
            onSuccess={() => router.push('/internal-items')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

