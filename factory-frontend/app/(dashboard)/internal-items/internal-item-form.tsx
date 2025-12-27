'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormError } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/lib/toast';
import { internalItemSchema, type InternalItemFormData } from '@/lib/schemas/internal-item';
import { InternalItem, internalItemsApi, CreateInternalItemInput, UpdateInternalItemInput } from '@/lib/api';

interface InternalItemFormProps {
  internalItem?: InternalItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InternalItemForm({ internalItem, onSuccess, onCancel }: InternalItemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InternalItemFormData>({
    resolver: zodResolver(internalItemSchema),
    defaultValues: {
      sku: internalItem?.sku || '',
      name: internalItem?.name || '',
      description: internalItem?.description || '',
      status: internalItem?.status || 'active',
    },
  });

  const status = watch('status');

  const onSubmit = async (data: InternalItemFormData) => {
    try {
      if (internalItem) {
        const updateData: UpdateInternalItemInput = {
          sku: data.sku,
          name: data.name,
          description: data.description || null,
          status: data.status,
        };
        await internalItemsApi.update(internalItem.id, updateData);
        toast.success('Item interno actualizado', 'Los cambios se guardaron correctamente');
      } else {
        const createData: CreateInternalItemInput = {
          sku: data.sku,
          name: data.name,
          description: data.description || null,
          status: data.status,
        };
        await internalItemsApi.create(createData);
        toast.success('Item interno creado', 'El item interno se creó correctamente');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error al guardar item interno:', error);
      toast.error('Error al guardar item interno', error.message || 'No se pudo guardar el item interno');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField>
        <Label htmlFor="sku">SKU *</Label>
        <Input id="sku" {...register('sku')} placeholder="SKU del item" aria-invalid={errors.sku ? 'true' : 'false'} />
        {errors.sku && <FormError>{errors.sku.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" {...register('name')} placeholder="Nombre del item" aria-invalid={errors.name ? 'true' : 'false'} />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descripción del item"
          rows={3}
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <FormError>{errors.description.message}</FormError>}
      </FormField>

      <FormField>
        <Label htmlFor="status">Estado</Label>
        <Select
          value={status}
          onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'archived')}
        >
          <SelectTrigger id="status" aria-invalid={errors.status ? 'true' : 'false'}>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="archived">Archivado</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <FormError>{errors.status.message}</FormError>}
      </FormField>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : internalItem ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

