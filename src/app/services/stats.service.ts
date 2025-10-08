import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  getImportKpis(): Observable<{competidores:number; areas:number; responsables:number}> {
    return this.http.get<{competidores:number; areas:number; responsables:number}>('/api/kpis/importaciones');
  }
}
