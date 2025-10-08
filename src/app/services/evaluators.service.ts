// src/app/services/evaluators.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { Evaluador } from '../shared/types';

@Injectable({ providedIn: 'root' })
export class EvaluatorsService {
  constructor(private api: ApiService) {}
  list(): Observable<{data:Evaluador[]}> { return this.api.get('/evaluadores'); }
  create(payload: Evaluador){ return this.api.post('/evaluadores', payload); }
  remove(id:number){ return this.api.delete(`/evaluadores/${id}`); }
}
