import { HttpPort } from '../ports';

/**
 * Clase que actúa como fábrica y contenedor para un cliente HTTP configurable.
 * Es agnóstica al framework, por lo que puede usarse en React, Vue, Angular, etc.
 */
export class HttpClientFactory {
  // Cliente HTTP actual que implementa la interfaz HttpPort
  private static client: HttpPort;

  // URL base para las peticiones HTTP
  private static baseURL: string;

  /**
   * Configura el cliente HTTP y opcionalmente la URL base.
   * Este método debe llamarse al iniciar la aplicación.
   *
   * @param client - Instancia que implementa HttpPort (por ejemplo, AxiosAdapter)
   * @param baseURL - URL base para las peticiones (opcional)
   */
  static configure(client: HttpPort, baseURL?: string) {
    this.client = client;
    if (baseURL) this.baseURL = baseURL;
  }

  /**
   * Devuelve el cliente HTTP configurado.
   * Si no se ha configurado explícitamente, se usa el cliente por defecto.
   *
   * @returns Instancia de HttpPort
   */
  static getClient(): HttpPort {
    if (!this.client) {
      throw new Error('HttpClientFactory: No se configuró ningún cliente HTTP');
    }
    return this.client;
  }

  /**
   * Devuelve la URL base configurada.
   * Si no se ha definido, retorna una cadena vacía.
   *
   * @returns string con la baseURL
   */
  static getBaseURL(): string {
    return this.baseURL;
  }
}
