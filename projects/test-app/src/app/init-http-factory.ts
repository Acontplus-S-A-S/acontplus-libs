import { FetchAdapter, HttpClientFactory } from '@acontplus-core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AngularHttpAdapter } from '@acontplus-core';

export function initHttpFactory() {
  return () => {
    // Opción 1: usar Angular HttpClient Adapter
    const http = inject(HttpClient);
    HttpClientFactory.configure(new AngularHttpAdapter(http));

    // Opción 2: usar FetchAdapter
    // HttpClientFactory.configure(new FetchAdapter(), 'https://localhost:7040/api');

    // Opción 3: usar AxiosAdapter
    // HttpClientFactory.configure(new AxiosAdapter({ baseURL: 'https://api.tuapp.com' }));

    return Promise.resolve();
  };
}
