import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 necesario para [(ngModel)]
import { Router } from '@angular/router';
import { EvaluationsService, EvaluacionFila } from '../../services/evaluations.service';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-evaluator-grades',
  imports: [CommonModule, FormsModule, NgIf, NgFor, NgClass], // 👈 FormsModule agregado
  styles: [`
    :host{ display:block; }
    .page{ padding:1rem 0 2rem; }

    .hello{ font-weight:800; color:#1f2937; font-size:clamp(1.35rem,2vw,1.75rem); }
    .area-pill{ background:#eefbf3; color:#166534; border-radius:999px; padding:.35rem .75rem; font-weight:700; }
    .btn-green{
      --bs-btn-bg:#16a34a; --bs-btn-border-color:#16a34a;
      --bs-btn-hover-bg:#15803d; --bs-btn-hover-border-color:#15803d;
      border-radius:.7rem;
    }

    .table-card{ border:1px solid #e6e9f2; border-radius:.8rem; overflow:hidden; background:#fff; box-shadow:0 10px 25px rgba(0,0,0,.05); }
    table{ width:100%; border-collapse:separate; border-spacing:0; }
    thead th{ background:#e9ecef; color:#111827; font-weight:700; padding:.7rem .9rem; border-bottom:1px solid #dfe3ea; }
    tbody td{ padding:.7rem .9rem; border-bottom:1px solid #f0f2f7; vertical-align:middle; }

    .input-pill{
      border:1px solid #e5e7eb; background:#f5f7fb; border-radius:999px; padding:.35rem .7rem; width:110px;
      outline:none;
    }
    .input-pill:focus{ background:#fff; border-color:#93c5fd; box-shadow:0 0 0 .2rem rgba(59,130,246,.15); }

    .comment-pill{
      border:1px solid #e5e7eb; background:#f5f7fb; border-radius:999px; padding:.35rem .9rem; width:220px;
    }
    .muted{ color:#94a3b8; }
    .error{ color:#dc2626; font-size:.85rem; }

    .actions{ display:flex; gap:.5rem; align-items:center; }
    .icon-btn{
      width:32px; height:32px; border-radius:8px; border:1px solid #e5e7eb; background:#fff;
      display:inline-flex; align-items:center; justify-content:center;
    }
    .icon-btn.active{ border-color:#93c5fd; background:#eff6ff; }
    .save-wrap{ display:flex; justify-content:flex-end; margin-top:1rem; }
  `],
  template: `
  <div class="page">
    <!-- Saludo + CTA como en el prototipo -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
      <div>
        <h2 class="hello mb-1">Hola, Evaluador</h2>
        <div class="d-flex align-items-center gap-2">
          <span class="muted">Area:</span>
          <span class="area-pill">{{ areaNombre() }}</span>
        </div>
      </div>
      <button class="btn btn-green btn-sm" (click)="goEvaluaciones()">
        <i class="bi bi-box-arrow-in-right"></i> Ir a Evaluaciones
      </button>
    </div>

    <h6 class="fw-bold mt-3 mb-2">Registro de Evaluaciones</h6>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>CI</th><th>Area</th><th>Nivel</th>
            <th>Nota Numérica</th><th>Comentario</th><th style="width:90px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows(); let i = index">
            <td>{{ row.olimpista.nombre_completo }}</td>
            <td>{{ row.olimpista.ci || '—' }}</td>
            <td>{{ row.area.nombre }}</td>
            <td>{{ row.nivel.nombre }}</td>
            <!-- NOTA (0-100) -->
            <td>
              <input class="input-pill"
                     type="number" inputmode="decimal" step="1" min="0" max="100"
                     [readonly]="!editingMap()[row.olimpista.id]"
                     [ngClass]="{'is-invalid': invalidNotaMap()[row.olimpista.id]}"
                     [(ngModel)]="editBuffer[row.olimpista.id].nota"
                     (ngModelChange)="validateNota(row.olimpista.id)" />
              <div *ngIf="invalidNotaMap()[row.olimpista.id]" class="error mt-1">0 a 100</div>
            </td>

            <!-- COMENTARIO (opcional, ≤250) -->
            <td>
              <input class="comment-pill" type="text" maxlength="250"
                     [readonly]="!editingMap()[row.olimpista.id]"
                     [(ngModel)]="editBuffer[row.olimpista.id].observacion" />
            </td>

            <!-- ACCIONES: editar/confirmar/cancelar -->
            <td class="actions">
              <button class="icon-btn" [ngClass]="{'active': editingMap()[row.olimpista.id]}"
                      (click)="toggleEdit(row.olimpista.id)">
                <i class="bi" [ngClass]="editingMap()[row.olimpista.id] ? 'bi-unlock' : 'bi-pencil'"></i>
              </button>
              <button class="icon-btn" title="Revertir"
                      (click)="revert(row.olimpista.id)" [disabled]="!editingMap()[row.olimpista.id]">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </td>
          </tr>

          <!-- filas fantasma para look del mock cuando hay pocos -->
          <tr *ngIf="rows().length===0">
            <td colspan="7" class="muted" style="padding:1rem .9rem">No hay asignaciones.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="save-wrap">
      <button class="btn btn-green" [disabled]="!dirty()" (click)="save()">
        <i class="bi bi-save"></i> Guardar Cambios
      </button>
    </div>

    <!-- Sólo admin: botón historial PDF -->
    <div *ngIf="isAdmin()" class="mt-3">
      <button class="btn btn-outline-dark btn-sm" (click)="exportHistorial()">
        <i class="bi bi-filetype-pdf"></i> Historial de cambios (PDF)
      </button>
    </div>

    <div *ngIf="msg()" class="alert alert-success mt-3 py-2">{{ msg() }}</div>
    <div *ngIf="err()" class="alert alert-danger mt-3 py-2">{{ err() }}</div>
  </div>
  `
})
export class EvaluatorGradesComponent implements OnInit {
  constructor(
    private api: EvaluationsService,
    private auth: AuthService,
    private router: Router
  ) {}

  // estado
  rows = signal<EvaluacionFila[]>([]);
  areaNombre = signal<string>('—');

  // buffer de edición por olimpista_id
  editBuffer: Record<number, {nota: number|null, observacion?: string}> = {};
  // mapas de edición/validación/dirty
  editingMap = signal<Record<number, boolean>>({});
  invalidNotaMap = signal<Record<number, boolean>>({});
  dirty = signal(false);

  msg = signal<string>(''); err = signal<string>('');

  ngOnInit(): void {
    // cargar asignaciones del evaluador autenticado
    this.api.getAsignados().subscribe({
      next: (res) => {
        this.rows.set(res);
        // área mostrada (si el evaluador tiene una única área asignada)
        const first = res[0]; this.areaNombre.set(first?.area?.nombre || '—');
        // inicializar buffers
        for (const r of res) {
          this.editBuffer[r.olimpista.id] = {
            nota: r.evaluacion?.nota ?? null,
            observacion: r.evaluacion?.observacion ?? ''
          };
        }
      },
      error: () => this.err.set('No se pudo cargar asignaciones')
    });
  }

  isAdmin(){ return this.auth.role() === 'admin'; }

  goEvaluaciones(){ this.router.navigate(['/evaluaciones']); }

  toggleEdit(id: number){
    const m = { ...this.editingMap() };
    m[id] = !m[id];
    this.editingMap.set(m);
  }

  revert(id: number){
    const original = this.rows().find(r => r.olimpista.id === id);
    if (!original) return;
    this.editBuffer[id] = {
      nota: original.evaluacion?.nota ?? null,
      observacion: original.evaluacion?.observacion ?? ''
    };
    const inv = { ...this.invalidNotaMap() }; delete inv[id]; this.invalidNotaMap.set(inv);
    this.computeDirty();
  }

  validateNota(id: number){
    const v = this.editBuffer[id]?.nota;
    const invalid = !(v === null || (v >= 0 && v <= 100));
    const map = { ...this.invalidNotaMap() }; map[id] = invalid; this.invalidNotaMap.set(map);
    this.computeDirty();
  }

  private computeDirty(){
    const orig = this.rows();
    let dirty = false;
    for (const r of orig) {
      const buf = this.editBuffer[r.olimpista.id];
      const n0 = r.evaluacion?.nota ?? null;
      const c0 = r.evaluacion?.observacion ?? '';
      if (buf?.nota !== n0 || (buf?.observacion ?? '') !== c0) { dirty = true; break; }
    }
    this.dirty.set(dirty);
  }

  save(){
    // validación global de notas
    if (Object.values(this.invalidNotaMap()).some(v => v)) {
      this.err.set('Hay notas fuera del rango 0-100. Corrige antes de guardar.'); return;
    }
    const payload = this.rows().map(r => ({
      id: r.evaluacion?.id, // si existe, actualizar; si no, crear
      olimpista_id: r.olimpista.id,
      nota: this.editBuffer[r.olimpista.id].nota,
      observacion: (this.editBuffer[r.olimpista.id].observacion || '').slice(0,250)
    }));

    this.api.saveBatch(payload).subscribe({
      next: (res) => {
        this.msg.set(`Cambios guardados (${res?.saved ?? payload.length}).`);
        this.err.set('');
        // sincroniza estado original para que deje de estar "dirty"
        const updated = this.rows().map(r => ({
          ...r,
          evaluacion: {
            ...r.evaluacion,
            nota: this.editBuffer[r.olimpista.id].nota,
            observacion: this.editBuffer[r.olimpista.id].observacion
          }
        }));
        this.rows.set(updated);
        this.computeDirty();
      },
      error: () => { this.err.set('Error al guardar cambios'); this.msg.set(''); }
    });
  }

  exportHistorial(){
    this.api.exportHistorialPDF().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'historial-evaluaciones.pdf'; a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.err.set('No se pudo exportar el PDF')
    });
  }
}
