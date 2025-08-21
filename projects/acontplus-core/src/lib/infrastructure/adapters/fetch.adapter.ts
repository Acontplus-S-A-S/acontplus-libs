import {HttpPort, HttpOptions} from "../../application/interfaces/http.port";
import {fetch} from "rxjs/src/internal/umd";
import * as url from "node:url";

export class FetchAdapter implements HttpPort {
  constructor(private baseURL: string) {}

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: options?.headers,
    });
    return response.json();
  }

  delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return Promise.resolve(undefined);
  }

  post<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    return Promise.resolve(undefined);
  }

  put<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    return Promise.resolve(undefined);
  }

  // ... otros métodos
}
