/**
 * Cliente API server-side para comunicarse con factory-backend
 * La API key se mantiene solo en el servidor
 */

import 'server-only';
import { auth } from '@/lib/auth';
import { 
  InternalItem,
  CreateInternalItemInput,
  UpdateInternalItemInput,
  InternalItemFilters,
  ItemAttribute,
  CreateAttributeInput,
  UpdateAttributeInput,
  User,
} from './api';

// Para usuarios, siempre usar el backend de Permit
const PERMIT_API_URL = process.env.PERMIT_API_URL || 'http://localhost:8000';
const PERMIT_API_KEY = process.env.PERMIT_API_KEY || '';

// Para Factory, usar el backend de Factory
const FACTORY_API_URL = process.env.FACTORY_API_URL || 'http://localhost:8000';
const FACTORY_API_KEY = process.env.FACTORY_API_KEY || PERMIT_API_KEY;

if (!PERMIT_API_KEY) {
  console.warn('⚠️ PERMIT_API_KEY no está configurada. Las llamadas al backend pueden fallar.');
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Función helper para hacer requests al backend con API key
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  usePermitBackend: boolean = false
): Promise<T> {
  const session = await auth();
  if (!session?.user) {
    throw new ApiError('No autenticado', 401);
  }

  const baseUrl = usePermitBackend ? PERMIT_API_URL : FACTORY_API_URL;
  const apiKey = usePermitBackend ? PERMIT_API_KEY : FACTORY_API_KEY;
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

// Re-exportar tipos del cliente público
export type {
  InternalItem,
  CreateInternalItemInput,
  UpdateInternalItemInput,
  InternalItemFilters,
  ItemAttribute,
  CreateAttributeInput,
  UpdateAttributeInput,
  User,
} from './api';

// ==================== USUARIOS (Permit) ====================

export const usersApi = {
  getAll: async () => {
    const res = await fetchApi<{ data: User[] }>('/v1/users/', undefined, true);
    return res.data;
  },
};

// ==================== INTERNAL ITEMS ====================

export const internalItemsApi = {
  getAll: async (filters?: InternalItemFilters): Promise<{ internalItems: InternalItem[]; total: number; offset: number | null }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('q', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.offset) params.set('offset', filters.offset.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    
    const query = params.toString();
    const res = await fetchApi<{ data: InternalItem[]; total: number; offset: number | null; limit: number | null }>(
      `/v1/internal-items${query ? `?${query}` : ''}`
    );
    return {
      internalItems: res.data,
      total: res.total ?? res.data.length,
      offset: res.offset ?? null,
    };
  },

  getById: async (id: number): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>(`/v1/internal-items/${id}`);
    return res.data;
  },

  create: async (data: CreateInternalItemInput): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>('/v1/internal-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id: number, data: UpdateInternalItemInput): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>(`/v1/internal-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string; data: InternalItem }> => {
    return fetchApi<{ message: string; data: InternalItem }>(`/v1/internal-items/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ATTRIBUTES ====================

export const attributesApi = {
  getByItem: async (internalItemId: number): Promise<ItemAttribute[]> => {
    const res = await fetchApi<{ data: ItemAttribute[] }>(`/v1/attributes/${internalItemId}`);
    return res.data;
  },

  create: async (data: CreateAttributeInput): Promise<ItemAttribute> => {
    const res = await fetchApi<{ data: ItemAttribute }>('/v1/attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id: number, data: UpdateAttributeInput): Promise<ItemAttribute> => {
    const res = await fetchApi<{ data: ItemAttribute }>(`/v1/attributes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string; data: ItemAttribute }> => {
    return fetchApi<{ message: string; data: ItemAttribute }>(`/v1/attributes/${id}`, {
      method: 'DELETE',
    });
  },
};

