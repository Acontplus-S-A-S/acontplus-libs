import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'acontplus-utils';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  #http = inject(HttpClient);
  #url = `Aplicacion/`;

  get() {
    return this.#http
      .get<ApiResponse>(this.#url)
      .pipe(map((response) => response));
  }
}
