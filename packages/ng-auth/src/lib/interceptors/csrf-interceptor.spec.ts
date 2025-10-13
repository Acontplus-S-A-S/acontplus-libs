import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpContext } from '@angular/common/http';
import { of } from 'rxjs';
import { csrfInterceptor, SKIP_CSRF } from './csrf-interceptor';
import { CsrfApi } from '../services/csrf-api';

describe('csrfInterceptor', () => {
  let csrfService: any;
  let mockHandler: HttpHandler;

  beforeEach(() => {
    csrfService = {
      getCsrfToken: jest.fn(),
    };

    mockHandler = {
      handle: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [{ provide: CsrfApi, useValue: csrfService }],
    });
  });

  it('should add CSRF token to POST requests to same origin', done => {
    csrfService.getCsrfToken.mockResolvedValue('test-csrf-token');
    const mockRequest = new HttpRequest('POST', '/api/test', { data: 'test' });

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        const calledRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
        expect(calledRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
        expect(calledRequest.method).toBe('POST');
        done();
      });
    });
  });

  it('should add CSRF token to PUT requests to same origin', done => {
    csrfService.getCsrfToken.mockResolvedValue('test-csrf-token');
    const mockRequest = new HttpRequest('PUT', '/api/test', { data: 'test' });

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        const calledRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
        expect(calledRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
        expect(calledRequest.method).toBe('PUT');
        done();
      });
    });
  });

  it('should add CSRF token to PATCH requests to same origin', done => {
    csrfService.getCsrfToken.mockResolvedValue('test-csrf-token');
    const mockRequest = new HttpRequest('PATCH', '/api/test', { data: 'test' });

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        const calledRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
        expect(calledRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
        expect(calledRequest.method).toBe('PATCH');
        done();
      });
    });
  });

  it('should add CSRF token to DELETE requests to same origin', done => {
    csrfService.getCsrfToken.mockResolvedValue('test-csrf-token');
    const mockRequest = new HttpRequest('DELETE', '/api/test');

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        const calledRequest = (mockHandler.handle as jest.Mock).mock.calls[0][0];
        expect(calledRequest.headers.get('X-CSRF-Token')).toBe('test-csrf-token');
        expect(calledRequest.method).toBe('DELETE');
        done();
      });
    });
  });

  it('should not add CSRF token to GET requests', () => {
    const mockRequest = new HttpRequest('GET', '/api/test');

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
      });
    });
  });

  it('should not add CSRF token to external requests', () => {
    const mockRequest = new HttpRequest('POST', 'https://external-api.com/test', { data: 'test' });

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(mockRequest, mockHandler.handle);

      result.subscribe(() => {
        expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
      });
    });
  });

  it('should skip CSRF token addition when SKIP_CSRF is true', () => {
    const mockRequest = new HttpRequest('POST', '/api/test', { data: 'test' });
    const requestWithSkip = mockRequest.clone({
      context: new HttpContext().set(SKIP_CSRF, true),
    });

    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));

    TestBed.runInInjectionContext(() => {
      const result = csrfInterceptor(requestWithSkip, mockHandler.handle);

      result.subscribe(() => {
        expect(mockHandler.handle).toHaveBeenCalledWith(requestWithSkip);
      });
    });
  });
});
