// src/app/pages/audit-log/audit-log.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-audit-log',
  imports: [CommonModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <h5>Auditoría de cambios</h5>
      <p class="text-muted small">Rastrea modificaciones de notas para reclamos o actualizaciones.</p>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
          <tbody>
            <tr *ngFor="let i of items()">
              <td class="text-muted small">{{i.fecha}}</td>
              <td class="fw-semibold">{{i.usuario}}</td>
              <td><span class="badge rounded-pill badge-soft-primary">{{i.accion}}</span></td>
              <td class="small">{{i.detalle}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
})
export class AuditLogComponent{
  items = signal<any[]>([
    { fecha:'2025-08-18 14:22', usuario:'rmendoza', accion:'UPDATE', detalle:'Nota 78.5 → 80.0 (ID Olimpista 112)' }
  ]);
}
