// src/app/pages/workflow/workflow.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-workflow',
  imports: [CommonModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <h5>Flujo por Área/Nivel</h5>
      <div class="row g-3 mt-1">
        <div class="col-12 col-lg-6" *ngFor="let g of grupos()">
          <div class="p-3 border rounded-4 bg-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold">{{g.area}}</div>
                <div class="text-muted small">Nivel: {{g.nivel}}</div>
              </div>
              <div class="d-flex gap-1">
                <span class="badge rounded-pill" [ngClass]="g.estadoClas==='Listo' ? 'badge-soft-primary':'bg-light'">Clasificación: {{g.estadoClas}}</span>
                <span class="badge rounded-pill" [ngClass]="g.estadoFinal==='Listo' ? 'badge-soft-primary':'bg-light'">Final: {{g.estadoFinal}}</span>
                <span class="badge rounded-pill" [ngClass]="g.reportes ? 'badge-soft-primary':'bg-light'">Reportes</span>
              </div>
            </div>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary"><i class="bi bi-clipboard2-check"></i> Ingresar notas</button>
              <button class="btn btn-sm btn-outline-primary"><i class="bi bi-check2-circle"></i> Cerrar fase</button>
              <button class="btn btn-sm btn-primary"><i class="bi bi-filetype-xlsx"></i> Generar lista</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class WorkflowComponent{
  grupos = signal<any[]>([
    { area:'Matemática', nivel:'Avanzado', estadoClas:'En curso', estadoFinal:'Pendiente', reportes:false },
    { area:'Robótica', nivel:'Intermedio', estadoClas:'Listo', estadoFinal:'Pendiente', reportes:false }
  ]);
}
