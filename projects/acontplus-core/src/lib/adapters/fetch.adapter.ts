import { HttpClientFactory } from './http-client-factory';
import { HttpOptions, HttpPort } from '../ports';

export class FetchAdapter implements HttpPort {
  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    return this.request<T>('PUT', url, body, options);
  }

  async delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: HttpOptions,
  ): Promise<T> {
    const baseURL = HttpClientFactory.getBaseURL();
    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
