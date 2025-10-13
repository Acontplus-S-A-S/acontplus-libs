import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthTokenRepositoryImpl } from '../repositories/auth-token-repository-impl';
import { AuthUrlRedirect } from '../services/auth-url-redirect';
import { ENVIRONMENT } from '@acontplus/ng-config';

describe('authGuard', () => {
  let tokenRepository: AuthTokenRepositoryImpl;
  let urlRedirectService: AuthUrlRedirect;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const tokenRepositoryMock = {
      isAuthenticated: jest.fn(),
    };
    const urlRedirectServiceMock = {
      storeIntendedUrl: jest.fn(),
    };
    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthTokenRepositoryImpl, useValue: tokenRepositoryMock },
        { provide: AuthUrlRedirect, useValue: urlRedirectServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ENVIRONMENT, useValue: { loginRoute: 'login' } },
      ],
    });

    tokenRepository = TestBed.inject(AuthTokenRepositoryImpl);
    urlRedirectService = TestBed.inject(AuthUrlRedirect);
    router = TestBed.inject(Router);

    route = {} as ActivatedRouteSnapshot;
    state = { url: '/protected-route' } as RouterStateSnapshot;
  });

  it('should allow access when user is authenticated', () => {
    (tokenRepository.isAuthenticated as jest.Mock).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
    expect(urlRedirectService.storeIntendedUrl).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login and store intended URL when user is not authenticated', () => {
    (tokenRepository.isAuthenticated as jest.Mock).mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(false);
    expect(urlRedirectService.storeIntendedUrl).toHaveBeenCalledWith('/protected-route');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
