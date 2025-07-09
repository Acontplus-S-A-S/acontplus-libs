import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@acontplus-core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private r url = `aplicaciones`;

  get() {
    return this.http.get<ApiResponse>(this.url).pipe(
      map((response) => {
        console.log(response);
        if (response.code) {
        }
      }),
    );
  }
}
