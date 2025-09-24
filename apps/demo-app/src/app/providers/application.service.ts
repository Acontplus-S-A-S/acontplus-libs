import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@acontplus/core';

export interface Application {
  id: number;
  name: string;
  description?: string;
  version: string;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private url = 'aplicaciones/';

  get(): Observable<Application[]> {
    // The interceptor handles all standardization - just return the data
    return this.http.get<Application[]>(this.url);
  }

  getById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.url}/${id}`);
  }

  create(application: Omit<Application, 'id'>): Observable<Application> {
    return this.http.post<Application>(this.url, application);
  }

  update(id: number, application: Partial<Application>): Observable<Application> {
    return this.http.put<Application>(`${this.url}/${id}`, application);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}
