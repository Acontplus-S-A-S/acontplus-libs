import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  #http = inject(HttpClient);
  #url = `Aplicacion`;

  get() {
    return this.#http.get<ApiResponse>(this.#url).pipe(
      map((response) => {
        console.log(response);
        if (response.code) {
        }
      }),
    );
  }
}
