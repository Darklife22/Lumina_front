// src/app/core/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: Record<string,string|number|boolean>): Observable<T> {
    let p = new HttpParams();
    if (params) Object.entries(params).forEach(([k,v]) => p = p.set(k, String(v)));
    return this.http.get<T>(url, { params: p });
  }
  post<T>(url: string, body: any): Observable<T> { return this.http.post<T>(url, body); }
  put<T>(url: string, body: any): Observable<T> { return this.http.put<T>(url, body); }
  delete<T>(url: string): Observable<T> { return this.http.delete<T>(url); }
}
