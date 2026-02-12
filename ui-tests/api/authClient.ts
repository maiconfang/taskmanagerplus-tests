
// api/authClient.ts
import { request } from '@playwright/test';

let cachedToken: string | null = null;

export async function getAccessToken() {
  if (cachedToken) return cachedToken;

  const context = await request.newContext();

  const response = await context.post('http://192.168.2.12:8080/oauth/token', {
    headers: {
      Authorization: 'Basic ' + Buffer.from('maif-web:web123').toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      username: 'luna.moon@maif.com',
      password: '123',
      grant_type: 'password'
    }
  });

  if (!response.ok()) {
    throw new Error(`Failed to get token: ${response.status()}`);
  }

  const body = await response.json();
  cachedToken = body.access_token;

  return cachedToken;
}
