
// api/provinceClient.ts
import { request } from '@playwright/test';
import { getAccessToken } from './authClient';

const BASE_URL = 'http://192.168.2.12:8080';

export async function createProvince(name: string, abbreviation: string) {
  const token = await getAccessToken();
  const context = await request.newContext();

  const response = await context.post(`${BASE_URL}/v1/provinces`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      name,
      abbreviation
    }
  });

  if (!response.ok()) {
    throw new Error(`Create failed: ${response.status()}`);
  }

  return response.json();
}

export async function deleteProvince(id: number) {
  const token = await getAccessToken();
  const context = await request.newContext();

  await context.delete(`${BASE_URL}/v1/provinces/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function listProvinces() {
  const token = await getAccessToken();
  const context = await request.newContext();

  const response = await context.get(`${BASE_URL}/v1/provinces`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok()) {
    throw new Error(`List failed: ${response.status()}`);
  }

  return response.json();
}

export async function getProvinceById(id: number) {
  const token = await getAccessToken();
  const context = await request.newContext();

  const response = await context.get(`${BASE_URL}/v1/provinces/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response;
}


// ------------------------------
// Failure-scenario helpers (raw responses)
// These functions DO NOT throw on non-2xx, so tests can assert failure modes.
// ------------------------------

export async function listProvincesRaw(token?: string) {
  const context = await request.newContext();
  return context.get(`${BASE_URL}/v1/provinces`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    }
  });
}

export async function createProvinceRaw(
  data: { name?: string; abbreviation?: string },
  options?: { token?: string; contentType?: string }
) {
  const context = await request.newContext();
  const contentType = options?.contentType ?? 'application/json';

  // If not JSON, send as plain text (simulates client misconfiguration)
  const payload: any =
    contentType === 'application/json' ? { data } : { data: JSON.stringify(data) };

  return context.post(`${BASE_URL}/v1/provinces`, {
    headers: {
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      'Content-Type': contentType
    },
    ...payload
  });
}

export async function updateProvinceRaw(
  id: number,
  data: { name?: string; abbreviation?: string },
  token?: string
) {
  const context = await request.newContext();
  return context.put(`${BASE_URL}/v1/provinces/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    },
    data
  });
}
