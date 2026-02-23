// ui-tests/api/taskApiClient.ts
import { request, APIRequestContext, expect } from '@playwright/test';
import { getAccessToken } from './authClient';

export type CreateTaskInput = {
  title: string;
  description: string;
  dueDate: string; // "YYYY-MM-DD"
  completed: boolean;
};

export type TaskDto = CreateTaskInput & {
  id: number;
};

export class TaskApiClient {
  private async newContext(): Promise<APIRequestContext> {
    const token = await getAccessToken();

    // Se você já tem BASE_URL em algum lugar, pode usar aqui.
    const baseURL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

    return await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createTask(input: CreateTaskInput): Promise<TaskDto> {
    const context = await this.newContext();
    const res = await context.post('/v1/tasks', { data: input });

    expect(res.ok(), `Create task failed: ${res.status()}`).toBeTruthy();

    const json = (await res.json()) as Partial<TaskDto>;

    // Se o backend retornar id direto:
    if (typeof json.id === 'number') return json as TaskDto;

    // Fallback: se não vier id, tenta buscar por title no "noPagination"
    const find = await context.get(`/v1/tasks/noPagination?title=${encodeURIComponent(input.title)}`);
    expect(find.ok(), `Find task failed: ${find.status()}`).toBeTruthy();

    const list = (await find.json()) as any[];
    const created = list?.find((t) => t?.title === input.title);

    if (!created?.id) {
      throw new Error('Task created but id was not returned and could not be found by title.');
    }

    return created as TaskDto;
  }

  async deleteTask(id: number): Promise<void> {
    const context = await this.newContext();
    const res = await context.delete(`/v1/tasks/${id}`);

    // Alguns deletes podem retornar 204 (ok) ou 200
    expect([200, 204].includes(res.status()), `Delete task failed: ${res.status()}`).toBeTruthy();
  }
}