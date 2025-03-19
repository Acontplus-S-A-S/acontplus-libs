import { inject } from '@angular/core';
import {
  HttpContextToken,
  HttpContext,
  HttpInterceptorFn,
} from '@angular/common/http';
import { ENVIRONMENT } from '../environments/environment.token';
import { JwtTokenService } from '../services/jwt-token.service';

const CUSTOM_URL = new HttpContextToken<boolean>(() => false);

export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}

export const injectSessionInterceptor: HttpInterceptorFn = (request, next) => {
  let jwtTokenService = inject(JwtTokenService);
  const authToken = jwtTokenService.getToken();
  const baseUrl = inject(ENVIRONMENT).apiBaseUrl;
  const clientId = inject(ENVIRONMENT).clientId;
  let isCustomUrl = false;
  if (request.context.get(CUSTOM_URL)) {
    isCustomUrl = true;
  }
  const url = isCustomUrl ? request.url : `${baseUrl}${request.url}`;

  request = request.clone({
    url,
    setHeaders: {
      Authorization: 'Bearer ' + authToken,
      'X-Client-Id': clientId,
    },
  });
  return next(request);
};
