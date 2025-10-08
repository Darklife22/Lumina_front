// src/app/pages/classification/classification.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-classification',
  imports: [CommonModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <div class="d-flex align-items-center justify-content-between">
        <h5 class="mb-0">Clasificados por Área y Nivel</h5>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary btn-sm"><i class="bi bi-download"></i> Exportar</button>
          <button class="btn btn-primary btn-sm"><i class="bi bi-megaphone"></i> Publicar</button>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table class="table align-middle">
          <thead><tr><th>Área</th><th>Nivel</th><th>Olimpista</th><th>Nota</th><th>Estado</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of clasificados()">
            <td>{{r.area}}</td>
            <td>{{r.nivel}}</td>
            <td class="fw-semibold">{{r.nombre}}</td>
            <td>{{r.nota}}</td>
            <td><span class="badge rounded-pill badge-soft-primary">Clasificado</span></td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  </div>
  `
})
export class ClassificationComponent{
  clasificados = signal<any[]>([
    { area: 'Matemática', nivel: 'Avanzado', nombre: 'Ana Ríos', nota: 85.4 },
    { area: 'Robótica', nivel: 'Intermedio', nombre: 'Luis Pérez', nota: 88.1 },
  ]);
}
