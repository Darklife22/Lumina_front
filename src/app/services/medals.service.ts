// src/app/services/medals.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { MedalleroConfig } from '../shared/types';

@Injectable({ providedIn: 'root' })
export class MedalsService {
  constructor(private api: ApiService) {}
  get(area_id:number){ return this.api.get<MedalleroConfig>('/medallero', { area_id }); }
  set(config: MedalleroConfig){ return this.api.post('/medallero', config); }
}
