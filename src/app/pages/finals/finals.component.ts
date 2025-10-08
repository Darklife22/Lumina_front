// src/app/pages/finals/finals.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-finals',
  imports: [CommonModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <h5 class="mb-2">Final: Ranking por Área/Nivel</h5>
      <div class="alert alert-info rounded-4">Una vez confirmados los resultados, se podrá generar el medallero y certificados.</div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Pos.</th><th>Olimpista</th><th>Área</th><th>Nivel</th><th>Nota</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of finalistas(); let i = index">
              <td class="fw-bold">{{i+1}}</td>
              <td class="fw-semibold">{{r.nombre}}</td>
              <td>{{r.area}}</td>
              <td>{{r.nivel}}</td>
              <td>{{r.nota}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary"><i class="bi bi-check2"></i> Confirmar Ranking</button>
        <button class="btn btn-primary"><i class="bi bi-award"></i> Generar Medallero</button>
      </div>
    </div>
  </div>
  `
})
export class FinalsComponent{
  finalistas = signal<any[]>([
    { nombre:'Sofía Gutiérrez', area:'Matemática', nivel:'Avanzado', nota:92.1 },
    { nombre:'Marcos Valdez', area:'Matemática', nivel:'Avanzado', nota:90.7 },
  ]);
}
