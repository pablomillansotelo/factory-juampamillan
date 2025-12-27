'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InternalItemForm } from '../internal-item-form';

export function InternalItemNewPageClient() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo item interno</CardTitle>
          <CardDescription>Crea un item interno para el catálogo de manufactura.</CardDescription>
        </CardHeader>
        <CardContent>
          <InternalItemForm
            internalItem={null}
            onCancel={() => router.push('/internal-items')}
            onSuccess={() => router.push('/internal-items')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

