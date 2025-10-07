import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenRepository } from '../repositories/token.repository';
import { UrlRedirectService } from '../services/url-redirect.service';
import { ENVIRONMENT } from '@acontplus/ng-config';

describe('authGuard', () => {
  let tokenRepository: TokenRepository;
  let urlRedirectService: UrlRedirectService;
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
        { provide: TokenRepository, useValue: tokenRepositoryMock },
        { provide: UrlRedirectService, useValue: urlRedirectServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ENVIRONMENT, useValue: { loginRoute: '/login' } },
      ],
    });

    tokenRepository = TestBed.inject(TokenRepository);
    urlRedirectService = TestBed.inject(UrlRedirectService);
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
