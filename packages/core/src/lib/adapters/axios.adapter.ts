import { HttpOptions, HttpPort } from '../ports';

export class AxiosAdapter implements HttpPort {
  private axios: any;

  constructor() {
    //this.axios = axios.create({ baseURL: HttpClientFactory.getBaseURL() });
  }

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    // const res = await this.axios.get<T>(url, { headers: options?.headers, params: options?.params });
    //   return res.data;
    throw new Error('override');
  }

  delete<T>(url: string, options?: HttpOptions): Promise<T> {
    throw new Error('override');
  }

  post<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    throw new Error('override');
  }

  put<T>(url: string, body: unknown, options?: HttpOptions): Promise<T> {
    throw new Error('override');
  }
  // post, put, delete igual
}
