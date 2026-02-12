
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
