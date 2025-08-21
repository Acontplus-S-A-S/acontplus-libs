// src/infrastructure/adapters/angular-http.adapter.ts
import { HttpClient } from '@angular/common/http';
import { HttpPort, HttpOptions} from '../../application/interfaces/http.port';
import { lastValueFrom } from 'rxjs';

function mergeUrl(baseURL?: string, url: string): string {
  return baseURL ? `${baseURL}${url}` : url;
}
export class AngularHttpAdapter implements HttpPort {
  constructor(
    private http: HttpClient,
    private baseURL?: string,
  ) {}

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    return await lastValueFrom(
      this.http.get<T>(`${mergeUrl(this.baseURL,url)}`, {
        headers: options?.headers,
        params: options?.params,
      }),
    );
  }

  async post<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return await lastValueFrom(
      this.http.post<T>(`${mergeUrl(this.baseURL,url)}`, data, {
        headers: options?.headers,
        params: options?.params,
      }),
    );
  }

  async put<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return await lastValueFrom(
      this.http.put<T>(`${mergeUrl(this.baseURL,url)}`, data, {
        headers: options?.headers,
        params: options?.params,
      }),
    );
  }

  async delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return await lastValueFrom(
      this.http.delete<T>(`${mergeUrl(this.baseURL,url)}`, {
        headers: options?.headers,
        params: options?.params,
      }),
    );
  }
}
