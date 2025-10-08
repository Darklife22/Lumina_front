// src/app/shared/types.ts
export interface Area { id: number; nombre: string; }
export interface Nivel { id: number; nombre: string; }
export interface Olimpista {
  id: number; nombre_completo: string; ci?: string; unidad_educativa: string;
  departamento: string; area_id: number; nivel_id: number; tutor?: string;
}
export interface Evaluacion {
  id?: number; olimpista_id: number; fase: 'clasificacion'|'final';
  nota: number | null; observacion?: string; evaluador_id?: number; updated_at?: string;
}
export interface Evaluador { id?: number; nombre: string; area_id: number; email?: string; telefono?: string; }
export interface MedalleroConfig { area_id: number; oros: number; platas: number; bronces: number; menciones: number; }
