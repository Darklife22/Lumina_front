// src/app/pages/evaluations/evaluations.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationsService } from '../../services/evaluations.service';
import { Evaluacion } from '../../shared/types';

@Component({
  standalone: true,
  selector: 'app-evaluations',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <div class="d-flex flex-wrap gap-2 align-items-end">
        <div>
          <label class="form-label">Fase</label>
          <select class="form-select" [(ngModel)]="filtro.fase">
            <option value="clasificacion">Clasificación</option>
            <option value="final">Final</option>
          </select>
        </div>
        <div>
          <label class="form-label">Área (ID)</label>
          <input class="form-control" type="number" [(ngModel)]="filtro.area_id"/>
        </div>
        <div>
          <label class="form-label">Nivel (ID)</label>
          <input class="form-control" type="number" [(ngModel)]="filtro.nivel_id"/>
        </div>
        <button class="btn btn-primary" (click)="buscar()"><i class="bi bi-search"></i> Buscar</button>
        <button class="btn btn-outline-primary" (click)="guardarTodo()" [disabled]="!dirty()"><i class="bi bi-save"></i> Guardar todo</button>
      </div>

      <div class="table-responsive mt-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th><th>Olimpista</th><th>Unidad</th><th>Nota</th><th>Observación</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rows(); let i = index">
              <td class="text-muted">{{i+1}}</td>
              <td class="fw-semibold">{{r.nombre}}</td>
              <td class="text-muted small">{{r.unidad}}</td>
              <td style="max-width:120px">
                <input class="form-control" type="number" step="0.01" min="0" max="100" [(ngModel)]="r.nota" (ngModelChange)="markDirty()" />
              </td>
              <td>
                <input class="form-control" placeholder="Descripción conceptual" [(ngModel)]="r.observacion" (ngModelChange)="markDirty()" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" (click)="reordenar()"><i class="bi bi-arrow-down-up"></i> Reordenar</button>
        <button class="btn btn-primary" (click)="cerrarFase()"><i class="bi bi-check2-circle"></i> Cerrar fase</button>
      </div>
    </div>
  </div>
  `
})
export class EvaluationsComponent {
  filtro = { fase: 'clasificacion', area_id: 0, nivel_id: 0 };
  data = signal<{id:number; nombre:string; unidad:string; olimpista_id:number; nota:number|null; observacion?:string}[]>([]);
  dirty = signal(false);

  constructor(private svc: EvaluationsService){}
  rows = computed(() => this.data());

  buscar(){ this.svc.list(this.filtro).subscribe(res => { this.data.set(res.data.map((x:any)=>({
      id:x.id, nombre:x.olimpista?.nombre_completo || '—', unidad: x.olimpista?.unidad_educativa || '—',
      olimpista_id:x.olimpista_id, nota:x.nota ?? null, observacion:x.observacion ?? ''
    }))); this.dirty.set(false); }); }

  markDirty(){ this.dirty.set(true); }
  guardarTodo(){
    const fase = this.filtro.fase as 'clasificacion'|'final';
    const items: Evaluacion[] = this.data().map(r => ({ olimpista_id: r.olimpista_id, fase, nota: r.nota, observacion: r.observacion || '' }));
    this.svc.bulkSave(items).subscribe(()=> this.dirty.set(false));
  }
  reordenar(){
    const orden = this.data().map(r => r.olimpista_id); // ejemplo simple
    this.svc.reorder(this.filtro.area_id, this.filtro.nivel_id, orden).subscribe();
  }
  cerrarFase(){
    this.svc.closePhase(this.filtro.fase as any, this.filtro.area_id, this.filtro.nivel_id).subscribe();
  }
}
