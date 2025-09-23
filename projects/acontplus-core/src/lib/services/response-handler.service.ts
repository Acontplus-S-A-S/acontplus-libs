import { Injectable } from '@angular/core';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlerService {
  /**
   * Handles API responses and extracts the appropriate data/message
   * @param response The response from the API (already processed by interceptor)
   * @returns A structured result with data and/or message
   */
  handleResponse<T>(response: any): ApiResponse<T> {
    // If it's already extracted data (success with data)
    if (response && typeof response === 'object' && !('status' in response)) {
      return {
        status: 'success',
        code: '200',
        message: 'Operation completed successfully',
        data: response as T,
        timestamp: new Date().toISOString(),
      };
    }

    // If it's a full ApiResponse structure
    if (response?.status === 'success') {
      return {
        status: 'success',
        code: response.code || '200',
        message: response.message,
        data: response.data,
        metadata: response.metadata,
        correlationId: response.correlationId,
        traceId: response.traceId,
        timestamp: response.timestamp || new Date().toISOString(),
      };
    }

    // For other cases, return as success with data
    return {
      status: 'success',
      code: '200',
      message: 'Operation completed successfully',
      data: response as T,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extracts only the data from a response (for operations that should return entities)
   * @param response The response from the API
   * @returns The extracted data
   */
  extractData<T>(response: any): T {
    const result = this.handleResponse<T>(response);
    return result.data as T;
  }

  /**
   * Extracts only the message from a response (for operations that return success messages)
   * @param response The response from the API
   * @returns The success message
   */
  extractMessage(response: any): string | undefined {
    const result = this.handleResponse(response);
    return result.message;
  }

  /**
   * Checks if the response contains data
   * @param response The response from the API
   * @returns True if the response contains data
   */
  hasData(response: any): boolean {
    if (response && typeof response === 'object' && !('status' in response)) {
      return true;
    }
    return (
      response?.status === 'success' && response?.data !== undefined && response?.data !== null
    );
  }

  /**
   * Checks if the response contains a success message
   * @param response The response from the API
   * @returns True if the response contains a success message
   */
  hasMessage(response: any): boolean {
    if (response && typeof response === 'object' && !('status' in response)) {
      return false; // Extracted data doesn't have messages
    }
    return response?.status === 'success' && !!response?.message;
  }
}
