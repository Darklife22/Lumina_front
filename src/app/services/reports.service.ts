// src/app/services/reports.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private api: ApiService) {}
  certificados(area_id:number, nivel_id:number){ return this.api.get('/reportes/certificados', { area_id, nivel_id }); }
  ceremonia(area_id:number, nivel_id:number){ return this.api.get('/reportes/ceremonia', { area_id, nivel_id }); }
  publicacion(area_id:number, nivel_id:number){ return this.api.get('/reportes/publicacion', { area_id, nivel_id }); }
  descargarExcel(endpoint:string, params:any){
    // Placeholder: en el backend enviar Content-Disposition + blob
    return this.api.get(`/reportes/${endpoint}`, params);
  }
}
