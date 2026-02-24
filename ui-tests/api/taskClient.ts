// ui-tests/api/taskClient.ts
import { request } from '@playwright/test';

const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

export type TaskPayload = {
  title?: string;
  description?: string;
  dueDate?: string; // Expected: YYYY-MM-DD
  completed?: boolean;
};

export async function listTasksRaw(token?: string) {
  const context = await request.newContext();
  return context.get(`${BASE_URL}/v1/tasks`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });
}

export async function createTaskRaw(
  data: TaskPayload,
  options?: { token?: string; contentType?: string }
) {
  const context = await request.newContext();
  const contentType = options?.contentType ?? 'application/json';

  // If not JSON, send as plain text (simulates client misconfiguration)
  const payload: any = contentType === 'application/json' ? { data } : { data: JSON.stringify(data) };

  return context.post(`${BASE_URL}/v1/tasks`, {
    headers: {
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      'Content-Type': contentType,
    },
    ...(contentType === 'application/json' ? { data } : payload),
  });
}

export async function updateTaskRaw(id: number, data: TaskPayload, token?: string) {
  const context = await request.newContext();
  return context.put(`${BASE_URL}/v1/tasks/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    data,
  });
}

export async function deleteTaskRaw(id: number, token?: string) {
  const context = await request.newContext();
  return context.delete(`${BASE_URL}/v1/tasks/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });
}
