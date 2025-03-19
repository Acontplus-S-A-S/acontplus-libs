import {
  HttpContext,
  HttpContextToken,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { hideLoader, showLoader } from '../utils';

const isLoader = new HttpContextToken<boolean>(() => true);

export function getNoLoader() {
  return new HttpContext().set(isLoader, false);
}

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  let requests: HttpRequest<any>[] = [];
  // const overlayService = inject(OverlayService);

  // let env = inject(ENVIRONMENT)

  // console.log(env)

  if (!req.context.get(isLoader)) {
    return next(req);
  }

  // console.log('is loader', req.context.get(isLoader))

  requests.push(req);

  // console.log("No of requests--->" + requests.length);

  if (requests.length === 1) {
    // overlayService.showSpinner();
    showLoader();
  }

  return next(req).pipe(
    finalize(() => {
      removeRequest(req);
    })
  );

  function removeRequest(req: HttpRequest<any>): void {
    const i = requests.indexOf(req);
    if (i >= 0) {
      requests.splice(i, 1);
    }

    if (requests.length === 0) {
      // overlayService.hideSpinner();
      hideLoader();
    }
  }
};
