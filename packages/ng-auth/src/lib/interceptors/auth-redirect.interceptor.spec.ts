import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { authRedirectInterceptor } from './auth-redirect.interceptor';
import { UrlRedirectService } from '../services/url-redirect.service';
import { TokenRepository } from '../repositories/token.repository';
import { ENVIRONMENT } from '@acontplus/ng-config';

describe('authRedirectInterceptor', () => {
  let router: Router;
  let urlRedirectService: UrlRedirectService;
  let tokenRepository: TokenRepository;
  let mockHandler: HttpHandler;

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn(),
    };
    const urlRedirectServiceMock = {
      storeCurrentUrlIfAllowed: jest.fn(),
    };
    const tokenRepositoryMock = {
      isAuthenticated: jest.fn(),
    };

    mockHandler = {
      handle: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UrlRedirectService, useValue: urlRedirectServiceMock },
        { provide: TokenRepository, useValue: tokenRepositoryMock },
        { provide: ENVIRONMENT, useValue: { loginRoute: '/login' } },
      ],
    });

    router = TestBed.inject(Router);
    urlRedirectService = TestBed.inject(UrlRedirectService);
    tokenRepository = TestBed.inject(TokenRepository);
  });

  it('should pass through successful requests', done => {
    const mockRequest = new HttpRequest('GET', '/api/data');
    const mockResponse = { status: 200, body: { data: 'test' } };

    (mockHandler.handle as jest.Mock).mockReturnValue(of(mockResponse));

    TestBed.runInInjectionContext(() => {
      const result = authRedirectInterceptor(mockRequest, mockHandler.handle);

      result.subscribe({
        next: response => {
          expect(response).toEqual(mockResponse);
          expect(urlRedirectService.storeCurrentUrlIfAllowed).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  it('should handle 401 error when user is authenticated', done => {
    const mockRequest = new HttpRequest('GET', '/api/protected');
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

    (mockHandler.handle as jest.Mock).mockReturnValue(throwError(() => mockError));
    (tokenRepository.isAuthenticated as jest.Mock).mockReturnValue(true);

    TestBed.runInInjectionContext(() => {
      const result = authRedirectInterceptor(mockRequest, mockHandler.handle);

      result.subscribe({
        error: error => {
          expect(error).toBe(mockError);
          expect(urlRedirectService.storeCurrentUrlIfAllowed).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        },
      });
    });
  });

  it('should handle 401 error without redirect when user is not authenticated', done => {
    const mockRequest = new HttpRequest('GET', '/api/protected');
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

    (mockHandler.handle as jest.Mock).mockReturnValue(throwError(() => mockError));
    (tokenRepository.isAuthenticated as jest.Mock).mockReturnValue(false);

    TestBed.runInInjectionContext(() => {
      const result = authRedirectInterceptor(mockRequest, mockHandler.handle);

      result.subscribe({
        error: error => {
          expect(error).toBe(mockError);
          expect(urlRedirectService.storeCurrentUrlIfAllowed).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  it('should pass through non-401 errors without intervention', done => {
    const mockRequest = new HttpRequest('GET', '/api/data');
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    (mockHandler.handle as jest.Mock).mockReturnValue(throwError(() => mockError));

    TestBed.runInInjectionContext(() => {
      const result = authRedirectInterceptor(mockRequest, mockHandler.handle);

      result.subscribe({
        error: error => {
          expect(error).toBe(mockError);
          expect(urlRedirectService.storeCurrentUrlIfAllowed).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
