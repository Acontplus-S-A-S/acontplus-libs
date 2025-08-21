import {FetchAdapter, HttpClientFactory} from "@acontplus-core";

export function initHttpFactory() {
  return () => {
    // Opción 1: usar Angular HttpClient Adapter
    // const http = inject(HttpClient);
    // HttpClientFactory.configure(new AngularHttpClientAdapter(http));

    // Opción 2: usar FetchAdapter
    HttpClientFactory.configure(new FetchAdapter(), 'https://jsonplaceholder.typicode.com');

    // Opción 3: usar AxiosAdapter
    // HttpClientFactory.configure(new AxiosAdapter({ baseURL: 'https://api.tuapp.com' }));

    return Promise.resolve();
  };
}
