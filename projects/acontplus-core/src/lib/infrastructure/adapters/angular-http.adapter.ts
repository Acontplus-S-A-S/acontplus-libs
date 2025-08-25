// src/infrastructure/adapters/angular-http.adapter.ts
import { HttpClient } from '@angular/common/http';
import { HttpPort, HttpOptions } from '../../application/interfaces/http.port';
import { lastValueFrom } from 'rxjs';

function mergeUrl(baseURL: string | undefined, endpoint: string): string {
  if (!baseURL) return endpoint;
  return `${baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

export class AngularHttpAdapter implements HttpPort {
  constructor(
    private readonly http: HttpClient,
    private readonly baseURL?: string,
  ) {}

  private buildOptions(options?: HttpOptions) {
    return {
      headers: options?.headers ?? {},
      params: options?.params ?? {},
    };
  }

  private async request<T>(params: {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
    data?: any;
    options?: HttpOptions;
  }): Promise<T> {
    const fullUrl = mergeUrl(this.baseURL, params.url);
    const httpOptions = this.buildOptions(params.options);

    const observable = this.http.request<T>(params.method, fullUrl, {
      body: params.data,
      ...httpOptions,
    });

    return await lastValueFrom(observable);
  }

  /** GET */
  get<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request({ method: 'get', url, options });
  }

  /** POST */
  post<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return this.request({ method: 'post', url, data, options });
  }

  /** PUT */
  put<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return this.request({ method: 'put', url, data, options });
  }

  /** DELETE */
  delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request({ method: 'delete', url, options });
  }
}
