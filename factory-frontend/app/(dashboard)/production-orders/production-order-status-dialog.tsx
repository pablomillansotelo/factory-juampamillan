'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormError } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import { productionOrderSchema, type ProductionOrderFormData } from '@/lib/schemas/production-order';
import { productionOrdersApi, ProductionOrder, UpdateProductionOrderInput } from '@/lib/api';

interface ProductionOrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionOrder: ProductionOrder;
  onSuccess: (updatedOrder: ProductionOrder) => void;
}

export function ProductionOrderStatusDialog({
  open,
  onOpenChange,
  productionOrder,
  onSuccess,
}: ProductionOrderStatusDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductionOrderFormData>({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      status: productionOrder.status,
      notes: productionOrder.notes || '',
      estimatedCompletionDate: productionOrder.estimatedCompletionDate 
        ? new Date(productionOrder.estimatedCompletionDate).toISOString().split('T')[0]
        : undefined,
    },
  });

  const status = watch('status');

  const onSubmit = async (data: ProductionOrderFormData) => {
    try {
      const updateData: UpdateProductionOrderInput = {
        status: data.status,
        notes: data.notes || undefined,
        estimatedCompletionDate: data.estimatedCompletionDate || undefined,
      };
      const updated = await productionOrdersApi.update(productionOrder.id, updateData);
      toast.success('Orden actualizada', 'El estado de la orden se actualizó correctamente');
      reset();
      onOpenChange(false);
      onSuccess(updated);
    } catch (error: any) {
      console.error('Error al actualizar orden:', error);
      toast.error('Error al actualizar orden', error.message || 'No se pudo actualizar la orden');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Actualizar Orden de Producción</DialogTitle>
          <DialogDescription>
            Actualiza el estado y la información de la orden de producción #{productionOrder.id}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <Label htmlFor="status">Estado *</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as any)}
            >
              <SelectTrigger id="status" aria-invalid={errors.status ? 'true' : 'false'}>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="in_production">En Producción</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <FormError>{errors.status.message}</FormError>}
          </FormField>

          <FormField>
            <Label htmlFor="estimatedCompletionDate">Fecha Estimada de Entrega</Label>
            <input
              id="estimatedCompletionDate"
              type="date"
              {...register('estimatedCompletionDate')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={errors.estimatedCompletionDate ? 'true' : 'false'}
            />
            {errors.estimatedCompletionDate && <FormError>{errors.estimatedCompletionDate.message}</FormError>}
          </FormField>

          <FormField>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notas adicionales sobre la orden"
              rows={3}
              aria-invalid={errors.notes ? 'true' : 'false'}
            />
            {errors.notes && <FormError>{errors.notes.message}</FormError>}
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

