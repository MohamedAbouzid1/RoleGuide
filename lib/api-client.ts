/**
 * API Client for communicating with Express backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Store token in memory or localStorage
let authToken: string | null = null;

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('auth_token');
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
};

export const getAuthToken = () => authToken;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (requiresAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSession: () =>
    apiRequest<{ user: any }>('/auth/session', {
      requiresAuth: true,
    }),

  logout: () => {
    setAuthToken(null);
  },
};

// Drafts API
export const draftsApi = {
  getAll: () =>
    apiRequest<any[]>('/drafts', {
      requiresAuth: true,
    }),

  getById: (id: string) =>
    apiRequest<any>(`/drafts/${id}`, {
      requiresAuth: true,
    }),

  create: (data: { title?: string; data?: any }) =>
    apiRequest<any>('/drafts', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  update: (id: string, data: { title?: string; data?: any }) =>
    apiRequest<any>(`/drafts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  patch: (id: string, data: { overallScore?: number; atsScore?: number; lastEvaluation?: any }) =>
    apiRequest<any>(`/drafts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  delete: (id: string) =>
    apiRequest<void>(`/drafts/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    }),

  createSnapshot: (id: string, data: any) =>
    apiRequest<any>(`/drafts/${id}/snapshot`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      requiresAuth: true,
    }),
};

// PDF API
export const pdfApi = {
  export: async (cvData: any): Promise<Blob> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/pdf/export`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cvData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Export failed' }));
      throw new Error(error.error || 'Failed to export PDF');
    }

    return response.blob();
  },
};

export default {
  auth: authApi,
  drafts: draftsApi,
  pdf: pdfApi,
  setAuthToken,
  getAuthToken,
};
