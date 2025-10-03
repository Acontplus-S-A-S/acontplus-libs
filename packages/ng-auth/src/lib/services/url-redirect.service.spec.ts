import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { UrlRedirectService } from './url-redirect.service';

describe('UrlRedirectService', () => {
  let service: UrlRedirectService;
  let router: Router;
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock router
    const routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
      url: '/dashboard',
    };

    // Mock sessionStorage
    mockSessionStorage = {};
    const mockStorage = {
      getItem: jest.fn((key: string) => mockSessionStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete mockSessionStorage[key];
      }),
    };

    // Mock document with sessionStorage
    const mockDocument = {
      defaultView: {
        sessionStorage: mockStorage,
      },
    };

    TestBed.configureTestingModule({
      providers: [
        UrlRedirectService,
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    service = TestBed.inject(UrlRedirectService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('SSR environment', () => {
    let ssrService: UrlRedirectService;

    beforeEach(() => {
      // Create separate TestBed for SSR testing
      TestBed.resetTestingModule();

      const routerMock = {
        navigate: jest.fn(),
        navigateByUrl: jest.fn(),
        url: '/dashboard',
      };

      TestBed.configureTestingModule({
        providers: [
          UrlRedirectService,
          { provide: Router, useValue: routerMock },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: {} },
        ],
      });

      ssrService = TestBed.inject(UrlRedirectService);
    });

    it('should handle SSR environment gracefully', () => {
      // Should not throw errors in SSR
      expect(() => {
        ssrService.storeIntendedUrl('/test');
        ssrService.getIntendedUrl();
        ssrService.clearIntendedUrl();
        ssrService.storeCurrentUrlIfAllowed();
      }).not.toThrow();

      // Should return null for getIntendedUrl in SSR
      expect(ssrService.getIntendedUrl()).toBeNull();
    });
  });

  describe('storeIntendedUrl', () => {
    it('should store the provided URL', () => {
      service.storeIntendedUrl('/dashboard');
      expect(mockSessionStorage['acp_redirect_url']).toBe('/dashboard');
    });

    it('should store current URL when no URL is provided', () => {
      service.storeIntendedUrl();
      expect(mockSessionStorage['acp_redirect_url']).toBe('/dashboard');
    });

    it('should not store excluded routes', () => {
      service.storeIntendedUrl('/login');
      expect(mockSessionStorage['acp_redirect_url']).toBeUndefined();
    });

    it('should remove query parameters from URL', () => {
      service.storeIntendedUrl('/dashboard?token=abc&id=123');
      expect(mockSessionStorage['acp_redirect_url']).toBe('/dashboard');
    });
  });

  describe('getIntendedUrl', () => {
    it('should return stored URL', () => {
      mockSessionStorage['acp_redirect_url'] = '/dashboard';
      expect(service.getIntendedUrl()).toBe('/dashboard');
    });

    it('should return null when no URL is stored', () => {
      expect(service.getIntendedUrl()).toBeNull();
    });
  });

  describe('redirectToIntendedUrl', () => {
    it('should redirect to stored URL and clear it', () => {
      mockSessionStorage['acp_redirect_url'] = '/dashboard';

      service.redirectToIntendedUrl();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
      expect(mockSessionStorage['acp_redirect_url']).toBeUndefined();
    });

    it('should redirect to default route when no URL is stored', () => {
      service.redirectToIntendedUrl('/home');

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect to default route when stored URL is excluded', () => {
      mockSessionStorage['acp_redirect_url'] = '/login';

      service.redirectToIntendedUrl('/home');

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('clearIntendedUrl', () => {
    it('should remove the stored URL', () => {
      mockSessionStorage['acp_redirect_url'] = '/test';
      service.clearIntendedUrl();
      expect(mockSessionStorage['acp_redirect_url']).toBeUndefined();
    });
  });

  describe('storeCurrentUrlIfAllowed', () => {
    it('should store current URL if it is not excluded', () => {
      service.storeCurrentUrlIfAllowed();
      expect(mockSessionStorage['acp_redirect_url']).toBe('/dashboard');
    });

    it('should not store current URL if it is excluded', () => {
      (router as any).url = '/login';

      service.storeCurrentUrlIfAllowed();

      expect(mockSessionStorage['acp_redirect_url']).toBeUndefined();
    });
  });
});
