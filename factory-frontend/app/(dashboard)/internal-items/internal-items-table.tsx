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
  CardFooter,
} from '@/components/ui/card';
import { InternalItem as InternalItemRow } from './internal-item-row';
import { InternalItem as InternalItemType } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';

interface InternalItemsTableProps {
  internalItems: InternalItemType[];
  total: number;
  currentOffset: number;
  nextOffset: number | null;
  onRefresh: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function InternalItemsTable({
  internalItems,
  total,
  currentOffset,
  nextOffset,
  onRefresh,
  onPrevPage,
  onNextPage,
}: InternalItemsTableProps) {
  const ITEMS_PER_PAGE = 5;

  const startIndex = Math.max(0, currentOffset - ITEMS_PER_PAGE);
  const endIndex = Math.min(currentOffset, total);

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internalItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No se encontraron items internos
                </TableCell>
              </TableRow>
            ) : (
              internalItems.map((item) => (
                <InternalItemRow key={item.id} internalItem={item} onRefresh={onRefresh} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              {total > 0 ? startIndex + 1 : 0}-{endIndex}
            </strong>{' '}
            de <strong>{total}</strong> items internos
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onPrevPage}
              variant="ghost"
              size="sm"
              disabled={currentOffset === ITEMS_PER_PAGE}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              onClick={onNextPage}
              variant="ghost"
              size="sm"
              disabled={nextOffset === null}
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

