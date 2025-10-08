// src/app/services/evaluations.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Area, Nivel, Olimpista, Evaluacion } from '../shared/types';

/* ===== Tipos auxiliares (evitan any y warnings) ===== */
export type Fase = 'clasificacion' | 'final';

export interface EvalFiltro {
  fase: Fase;
  area_id?: number;
  nivel_id?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface EvaluacionFila {
  olimpista: Pick<Olimpista, 'id' | 'nombre_completo' | 'ci' | 'area_id' | 'nivel_id'>;
  area: Area;
  nivel: Nivel;
  evaluacion: Evaluacion;   // puede venir con nota/observacion nulos
}

export interface EvalListResponse {
  data: EvaluacionFila[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface EvalSaveItem {
  id?: number;                 // si existe -> update; si no -> create
  olimpista_id: number;
  nota: number | null;         // 0..100 o null
  observacion?: string;        // max 250
}

@Injectable({ providedIn: 'root' })
export class EvaluationsService {
  constructor(private api: ApiService) {}

  /* ====== Lo que ya tenías (respeto endpoints) ====== */
  list(params: any){                               // GET /evaluaciones
    return this.api.get<EvalListResponse>('/evaluaciones', params);
  }

  save(ev: Evaluacion){                            // POST /evaluaciones
    return this.api.post('/evaluaciones', ev);
  }

  bulkSave(items: Evaluacion[]){                   // POST /evaluaciones/bulk
    return this.api.post<{saved:number}>('/evaluaciones/bulk', { items });
  }

  reorder(area_id:number, nivel_id:number, orden:number[]){ // POST /evaluaciones/reordenar
    return this.api.post('/evaluaciones/reordenar', { area_id, nivel_id, orden });
  }

  closePhase(fase:Fase, area_id:number, nivel_id:number){   // POST /evaluaciones/cerrar-fase
    return this.api.post<{closed:boolean}>('/evaluaciones/cerrar-fase', { fase, area_id, nivel_id });
  }

  /* ====== NUEVO para la vista del Evaluador ====== */

  /** Trae las evaluaciones asignadas al evaluador autenticado */
  getAsignados(): Observable<EvaluacionFila[]> {
    return this.api.get<EvaluacionFila[]>('/evaluaciones/asignados');
  }

  /**
   * Guardado en lote desde pantalla de evaluador.
   * Si ya tienes /evaluaciones/bulk y quieres reutilizarlo, deja la 1ª línea.
   * Si expones un endpoint específico (/evaluaciones/guardar), usa la 2ª línea.
   */
  saveBatch(payload: EvalSaveItem[]): Observable<{saved:number}> {
    // return this.api.post<{saved:number}>('/evaluaciones/bulk', { items: payload }); // reutiliza bulk
    return this.api.post<{saved:number}>('/evaluaciones/guardar', payload);           // endpoint específico
  }

  /** Solo admin: exportar historial de cambios en PDF */
   exportHistorialPDF(): Observable<any> {
  return this.api.get('/evaluaciones/historial/pdf', { responseType: 'blob' });
}


}
