import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ── Tipos locales (si no los quieres, cambia por `any`)
export interface Olympist {
  id?: string;
  nombre: string;
  ci: string;
  area: string;
  nivel: string;
  unidad_educativa?: string;
  profesor?: string;
  departamento?: string;
  created_at?: string;
}
export interface ImportResult {
  inserted: number;
  updated: number;
  errors?: Array<{ line: number; message: string }>;
  rows?: Olympist[];
}

@Injectable({ providedIn: 'root' })
export class OlympistsService {
  private http = inject(HttpClient);
  private base = '/api/olympists';

  list(): Observable<Olympist[]> {
    return this.http.get<Olympist[]>(`${this.base}`).pipe(catchError(this.handle));
  }

  importCsv(file: File): Observable<ImportResult> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<ImportResult>(`${this.base}/import`, fd).pipe(catchError(this.handle));
  }

  private handle(err: HttpErrorResponse) {
    const message =
      (err.error && (err.error.message || err.error.error)) ||
      err.statusText || 'Error de red';
    return throwError(() => new Error(message));
  }
}
