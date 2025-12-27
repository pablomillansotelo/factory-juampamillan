/**
 * Cliente API para comunicarse con las rutas API de Next.js
 * Las rutas API actúan como proxy y manejan la autenticación y API key server-side
 */

const PERMIT_API_BASE_URL = '/api/permit';
const FACTORY_API_BASE_URL = '/api/factory';

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

async function fetchApi<T>(
  baseUrl: string,
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

// ==================== USUARIOS (Permit) ====================

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string | Date;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await fetchApi<{ data: User[] }>(PERMIT_API_BASE_URL, '/v1/users/');
    return res.data;
  },
};

// ==================== INTERNAL ITEMS ====================

export type InternalItemStatus = 'active' | 'inactive' | 'archived';

export interface InternalItem {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  status: InternalItemStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateInternalItemInput {
  sku: string;
  name: string;
  description?: string | null;
  status?: InternalItemStatus;
}

export interface UpdateInternalItemInput {
  sku?: string;
  name?: string;
  description?: string | null;
  status?: InternalItemStatus;
}

export interface InternalItemFilters {
  search?: string;
  status?: InternalItemStatus;
  offset?: number;
  limit?: number;
}

export const internalItemsApi = {
  getAll: async (filters?: InternalItemFilters): Promise<{ internalItems: InternalItem[]; total: number; offset: number | null }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('q', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.offset) params.set('offset', filters.offset.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    
    const query = params.toString();
    const res = await fetchApi<{ data: InternalItem[]; total: number; offset: number | null; limit: number | null }>(
      FACTORY_API_BASE_URL,
      `/v1/internal-items${query ? `?${query}` : ''}`
    );
    return {
      internalItems: res.data,
      total: res.total ?? res.data.length,
      offset: res.offset ?? null,
    };
  },

  getById: async (id: number): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>(FACTORY_API_BASE_URL, `/v1/internal-items/${id}`);
    return res.data;
  },

  create: async (data: CreateInternalItemInput): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>(FACTORY_API_BASE_URL, '/v1/internal-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id: number, data: UpdateInternalItemInput): Promise<InternalItem> => {
    const res = await fetchApi<{ data: InternalItem }>(FACTORY_API_BASE_URL, `/v1/internal-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string; data: InternalItem }> => {
    return fetchApi<{ message: string; data: InternalItem }>(FACTORY_API_BASE_URL, `/v1/internal-items/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ATTRIBUTES ====================

export interface ItemAttribute {
  id: number;
  internalItemId: number;
  key: string;
  value: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateAttributeInput {
  internalItemId: number;
  key: string;
  value: string;
}

export interface UpdateAttributeInput {
  key?: string;
  value?: string;
}

export const attributesApi = {
  getByItem: async (internalItemId: number): Promise<ItemAttribute[]> => {
    const res = await fetchApi<{ data: ItemAttribute[] }>(FACTORY_API_BASE_URL, `/v1/attributes/${internalItemId}`);
    return res.data;
  },

  create: async (data: CreateAttributeInput): Promise<ItemAttribute> => {
    const res = await fetchApi<{ data: ItemAttribute }>(FACTORY_API_BASE_URL, '/v1/attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id: number, data: UpdateAttributeInput): Promise<ItemAttribute> => {
    const res = await fetchApi<{ data: ItemAttribute }>(FACTORY_API_BASE_URL, `/v1/attributes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: number): Promise<{ message: string; data: ItemAttribute }> => {
    return fetchApi<{ message: string; data: ItemAttribute }>(FACTORY_API_BASE_URL, `/v1/attributes/${id}`, {
      method: 'DELETE',
    });
  },
};

