import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryConfig } from './interfaces';

@Injectable()
export abstract class BaseHttpRepository {
  protected http = inject(HttpClient);
  protected abstract config: RepositoryConfig; // Abstract property

  protected buildUrl(path = ''): string {
    const baseUrl = this.config.baseUrl || '/api';
    const version = this.config.version ? `/v${this.config.version}` : '';
    const endpoint = path ? `${this.config.endpoint}/${path}` : this.config.endpoint;

    return `${baseUrl}${version}/${endpoint}`.replace(/\/+/g, '/');
  }

  protected get<T>(path = '', params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), { params });
  }

  protected post<T>(path = '', body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  protected put<T>(path = '', body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  protected patch<T>(path = '', body?: unknown): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), body);
  }

  protected delete<T>(path = ''): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path));
  }
}
