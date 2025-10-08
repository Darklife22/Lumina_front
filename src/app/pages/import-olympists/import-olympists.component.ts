import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { OlympistsService } from '../../services/olympists.service';
import { StatsService } from '../../services/stats.service';

@Component({
  standalone: true,
  selector: 'app-import-olympists',
  imports: [CommonModule, NgIf, NgFor, NgClass],
  styles: [`
    :host{ display:block; }
    .page{ padding:1rem 0 2rem; }

    /* ====== KPIs ====== */
    .kpis{ display:grid; gap:1rem; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom:1rem; }
    @media (max-width: 900px){ .kpis{ grid-template-columns: 1fr; } }
    .kpi{
      background:#fff; border:1px solid #eef1f7; border-radius:1rem; padding:1rem 1.25rem;
      box-shadow:0 12px 30px rgba(0,0,0,.06);
    }
    .kpi .icon{
      width:36px;height:36px;border-radius:.65rem; display:inline-flex; align-items:center; justify-content:center;
      background:#eef5ff; color:#1e40af; margin-right:.5rem;
    }
    .kpi .label{ color:#6b7280; font-weight:600; font-size:.9rem; }
    .kpi .value{ font-weight:800; font-size:1.5rem; color:#0f172a; margin-top:.15rem; }

    /* ====== Encabezado ====== */
    .page-title{ font-weight:800; letter-spacing:.2px; color:#1e293b; font-size:clamp(1.35rem,2vw,1.75rem); }
    .btn-outline-success{ border-radius:.65rem; }
    .btn-primary{
      --bs-btn-bg:#3b82f6; --bs-btn-border-color:#3b82f6;
      --bs-btn-hover-bg:#2563eb; --bs-btn-hover-border-color:#2563eb; border-radius:.65rem;
    }

    /* ====== Grid (tabla izquierda – import derecha) ====== */
    .grid{ display:grid; gap:1.25rem; grid-template-columns: 1fr 380px; }
    @media (max-width: 1100px){ .grid{ grid-template-columns: 1fr; } }

    /* ====== Tabla ====== */
    .table-card{ border:1px solid #e6e9f2; border-radius:.8rem; overflow:hidden; background:#fff; box-shadow:0 10px 25px rgba(0,0,0,.05); }
    .tbl{ width:100%; border-collapse:separate; border-spacing:0; }
    .tbl thead th{ background:#e9ecef; color:#111827; font-weight:700; padding:.7rem .9rem; border-bottom:1px solid #dfe3ea; }
    .tbl tbody td{ padding:.7rem .9rem; border-bottom:1px solid #f0f2f7; color:#1f2937; }
    .tbl tbody tr:last-child td{ border-bottom:0; }
    .tbl .empty{ color:#94a3b8; font-style:italic; }

    /* ====== Panel Importar ====== */
    .panel{ background:#fff; border-radius:.9rem; padding:1.1rem; border:1px solid #e6e9f2; box-shadow:0 10px 25px rgba(0,0,0,.05); height:fit-content; }
    .panel h6{ font-weight:800; color:#1f2937; margin:0 0 .75rem; font-size:clamp(1rem,1.4vw,1.15rem); }
    .drop{ border:2px dashed #c7d2fe; border-radius:.9rem; background:#fafbff; padding:2rem 1rem; text-align:center; transition:.15s; }
    .drop.drop-hover{ border-color:#3b82f6; box-shadow:0 8px 20px rgba(59,130,246,.12); }
    .drop .icon{ font-size:40px; line-height:1; display:block; margin-bottom:.35rem; color:#94a3b8; }
    .drop small{ color:#6b7280; }
    .hidden-input{ display:none; }
    .alert{ border-radius:.75rem; }
  `],
  template: `
  <div class="page">
    <!-- ===== KPIs superioes (como en el prototipo) ===== -->
    <div class="kpis">
      <div class="kpi d-flex align-items-center">
        <div class="icon"><i class="bi bi-person-badge"></i></div>
        <div>
          <div class="label">Competidores</div>
          <div class="value">{{ kpiCompetidores() }}</div>
        </div>
      </div>
      <div class="kpi d-flex align-items-center">
        <div class="icon"><i class="bi bi-grid-3x3-gap"></i></div>
        <div>
          <div class="label">Áreas</div>
          <div class="value">{{ kpiAreas() }}</div>
        </div>
      </div>
      <div class="kpi d-flex align-items-center">
        <div class="icon"><i class="bi bi-shield-check"></i></div>
        <div>
          <div class="label">Responsables</div>
          <div class="value">{{ kpiResponsables() }}</div>
        </div>
      </div>
    </div>

    <!-- ===== Encabezado título + botones ===== -->
    <div class="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
      <h2 class="page-title mb-0">Registro de competidores</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success btn-sm" type="button">
          <i class="bi bi-plus"></i> Nuevo
        </button>
        <button class="btn btn-primary btn-sm" type="button" (click)="openPicker()">
          <i class="bi bi-cloud-upload"></i> Importar CSV
        </button>
      </div>
    </div>

    <!-- ===== Grid principal ===== -->
    <div class="grid">
      <!-- TABLA IZQ -->
      <div class="table-card">
        <table class="tbl">
          <thead>
            <tr>
              <th style="width:40%">Nombre</th>
              <th style="width:20%">CI</th>
              <th style="width:25%">Area</th>
              <th style="width:15%">Nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of tableRows">
              <td>{{ r.nombre || '—' }}</td>
              <td>{{ r.ci || '—' }}</td>
              <td>{{ r.area || '—' }}</td>
              <td>{{ r.nivel || '—' }}</td>
            </tr>
            <ng-container *ngIf="tableRows.length === 0">
              <tr *ngFor="let _ of blanks"><td class="empty" colspan="4">&nbsp;</td></tr>
            </ng-container>
          </tbody>
        </table>
      </div>

      <!-- PANEL DER: Importar CSV -->
      <div class="panel">
        <h6>Importar CSV</h6>
        <div class="drop" [ngClass]="{'drop-hover': hovering}"
             (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
          <i class="bi bi-upload icon"></i>
          <div class="mb-2">Arrastra y Suelta el archivo</div>
          <small>…o haz clic en <u>Importar CSV</u> arriba</small>
        </div>
        <input #fileInput class="hidden-input" type="file" accept=".csv" (change)="onFile($event)">
        <div *ngIf="uiError" class="alert alert-danger mt-3 small mb-0"><i class="bi bi-x-circle"></i> {{ uiError }}</div>
        <div *ngIf="okMsg" class="alert alert-success mt-3 small mb-0"><i class="bi bi-check-circle"></i> {{ okMsg }}</div>
      </div>
    </div>
  </div>
  `
})
export class ImportOlympistsComponent implements OnInit {
  // KPIs
  kpiCompetidores = signal(0);
  kpiAreas = signal(0);
  kpiResponsables = signal(0);

  // tabla
  tableRows: Array<{nombre?:string;ci?:string;area?:string;nivel?:string}> = [];
  blanks = Array.from({length: 7});

  // estado UI
  uiError: string | null = null;
  okMsg: string | null = null;
  hovering = false;

  constructor(private svc: OlympistsService, private stats: StatsService) {}

  ngOnInit(): void {
    // Llama a tu API real; si aún no está lista, deja los mock por ahora
    this.stats.getImportKpis().subscribe({
      next: (k) => {
        this.kpiCompetidores.set(k.competidores ?? 0);
        this.kpiAreas.set(k.areas ?? 0);
        this.kpiResponsables.set(k.responsables ?? 0);
      },
      error: () => {
        // mocks para desarrollo visual
        this.kpiCompetidores.set(324);
        this.kpiAreas.set(12);
        this.kpiResponsables.set(8);
      }
    });
  }

  openPicker(){ document.querySelector<HTMLInputElement>('input[type="file"].hidden-input')?.click(); }

  onDragOver(e: DragEvent){ e.preventDefault(); this.hovering = true; }
  onDragLeave(e: DragEvent){ e.preventDefault(); this.hovering = false; }
  onDrop(e: DragEvent){ e.preventDefault(); this.hovering = false; const f = e.dataTransfer?.files?.item(0) || null; if (f) this.handleFile(f); }
  onFile(e: Event){ const input = e.target as HTMLInputElement; const f = input.files?.[0] ?? null; if (f) this.handleFile(f); }

  private handleFile(f: File){
    this.uiError = this.okMsg = null;
    if (!f.name.toLowerCase().endsWith('.csv')) { this.uiError = 'Solo se permite subir archivos con extensión .csv'; return; }
    this.svc.importCsv(f).subscribe({
      next: (res: any) => {
        this.okMsg = `Importación completa. Insertados: ${res?.inserted ?? 0}, Actualizados: ${res?.updated ?? 0}.`;
        this.tableRows = res?.rows?.length ? res.rows : [];
      },
      error: (err) => this.uiError = 'Error en la importación: ' + (err?.message || 'desconocido')
    });
  }
}
