// ui-tests/api/userClient.ts
import { request, APIResponse } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

export type UserCreatePayload = {
  name?: string;
  email?: string;
  password?: string;
};

export type UserUpdatePayload = {
  id?: number | string;
  name?: string;
  email?: string;
};

export type UserChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

function authHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listUsersRaw(token?: string): Promise<APIResponse> {
  const context = await request.newContext();
  return context.get(`${BASE_URL}/v1/usserrs`, {
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json',
    },
  });
}


export async function findUsersRaw(
  params: { name?: string; email?: string; page?: number; size?: number },
  token?: string
): Promise<APIResponse> {
  const context = await request.newContext();

  const search = new URLSearchParams();
  if (params.name) search.set('name', params.name);
  if (params.email) search.set('email', params.email);
  search.set('page', String(params.page ?? 0));
  search.set('size', String(params.size ?? 10));

  return context.get(`${BASE_URL}/v1/usserrs?${search.toString()}`, {
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json',
    },
  });
}

export async function createUserRaw(
  data: UserCreatePayload,
  options?: { token?: string; contentType?: string }
): Promise<APIResponse> {
  const context = await request.newContext();
  const contentType = options?.contentType ?? 'application/json';

  // If not JSON, send as plain text (simulates client misconfiguration)
  const payload: any = contentType === 'application/json' ? { data } : { data: JSON.stringify(data) };

  return context.post(`${BASE_URL}/v1/usserrs`, {
    headers: {
      ...authHeader(options?.token),
      'Content-Type': contentType,
    },
    ...(contentType === 'application/json' ? { data } : payload),
  });
}

export async function updateUserRaw(id: number, data: UserUpdatePayload, token?: string): Promise<APIResponse> {
  const context = await request.newContext();
  return context.put(`${BASE_URL}/v1/usserrs/${id}`, {
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json',
    },
    data,
  });
}

export async function changeUserPasswordRaw(
  id: number,
  data: UserChangePasswordPayload,
  token?: string
): Promise<APIResponse> {
  const context = await request.newContext();
  return context.put(`${BASE_URL}/v1/usserrs/${id}/password`, {
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json',
    },
    data,
  });
}
