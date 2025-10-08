// src/app/pages/dashboard/dashboard.component.ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterLink],
  styles: [`
    :host { display:block; }

    /* Header band */
    .band {
      background: linear-gradient(135deg, #0c1f49 0%, #184789 55%, #1b56ad 100%);
      color: #fff;
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.15);
    }
    .brand { display:flex; align-items:center; gap:.65rem; }
    .brand img { height:32px; }
    .brand .title { font-weight:800; letter-spacing:.2px; }

    /* KPIs */
    .kpi {
      border-radius: 1rem;
      background: #fff;
      border: 1px solid #eef1f5;
      padding: 1rem;
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.05);
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .kpi:hover { transform: translateY(-2px); box-shadow: 0 .75rem 1.25rem rgba(0,0,0,.08); }
    .kpi .icon {
      width:40px; height:40px; border-radius:10px;
      display:grid; place-items:center; background:#eff5ff; color:#0f3f94;
      margin-bottom:.5rem;
    }
    .kpi .label { color:#6c757d; font-size:.85rem; }
    .kpi .value { font-weight:800; font-size: clamp(1.25rem, 3.2vw, 1.75rem); }

    /* Cards */
    .cardx {
      border-radius: 1rem; background:#fff; border:1px solid #eef1f5;
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.05);
    }
    .cardx-header { padding: .9rem 1rem; border-bottom: 1px solid #f0f2f6; }
    .cardx-body { padding: 1rem; }

    /* Progress pills */
    .stage {
      display:flex; align-items:center; gap:.6rem;
      padding:.65rem .8rem; border-radius:.75rem; background:#f7f9fc; border:1px solid #eef1f5;
    }
    .stage .dot { width:10px; height:10px; border-radius:999px; background:#6c757d; }
    .stage.done .dot { background:#28a745; }
    .stage.active .dot { background:#0d6efd; }
    .stage small { color:#6c757d; }

    /* Buttons */
    .btn-round { border-radius:.8rem; }

    /* Tiny fade */
    @keyframes fadeUp { from{opacity:0; transform: translateY(8px);} to{opacity:1; transform:none;} }
    .anim { animation: fadeUp .35s ease-out both; }
  `],
  template: `
  <div class="container py-3 py-md-4">

    <!-- Header band -->
    <div class="band mb-3 anim">
      <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div class="brand">
          <img src="/logo/logo.png" alt="Lumina logo">
          <div>
            <div class="title">Panel de control</div>
            <small class="opacity-75">Gestión de evaluaciones y reportes</small>
          </div>
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/evaluaciones" class="btn btn-light btn-round">
            <i class="bi bi-clipboard2-check"></i> Ingresar notas
          </a>
          <a routerLink="/reportes" class="btn btn-outline-light btn-round">
            <i class="bi bi-filetype-xlsx"></i> Reportes
          </a>
        </div>
      </div>
    </div>

    <div class="row g-3">

      <!-- KPIs -->
      <div class="col-6 col-md-3">
        <div class="kpi anim">
          <div class="icon"><i class="bi bi-people-fill"></i></div>
          <div class="label">Inscritos</div>
          <div class="value">2,140</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi anim">
          <div class="icon"><i class="bi bi-ui-checks-grid"></i></div>
          <div class="label">Evaluaciones</div>
          <div class="value">1,860</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi anim">
          <div class="icon"><i class="bi bi-trophy"></i></div>
          <div class="label">Clasificados</div>
          <div class="value">640</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi anim">
          <div class="icon"><i class="bi bi-award"></i></div>
          <div class="label">Finalistas</div>
          <div class="value">120</div>
        </div>
      </div>

      <!-- Col izquierda -->
      <div class="col-12 col-lg-8">
        <!-- Progreso & flujo -->
        <div class="cardx anim mb-3">
          <div class="cardx-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Estado del proceso</h6>
            <span class="badge text-bg-light">Actualizado hoy</span>
          </div>
          <div class="cardx-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="stage done">
                  <span class="dot"></span>
                  <div>
                    <div class="fw-semibold">Importación de inscritos</div>
                    <small>CSV validado y listo</small>
                  </div>
                  <span class="ms-auto badge bg-success-subtle text-success">Listo</span>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="stage active">
                  <span class="dot"></span>
                  <div>
                    <div class="fw-semibold">Evaluación (Clasificación)</div>
                    <small>Notas en tiempo real</small>
                  </div>
                  <span class="ms-auto badge bg-primary-subtle text-primary">En curso</span>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="stage">
                  <span class="dot"></span>
                  <div>
                    <div class="fw-semibold">Evaluación (Final)</div>
                    <small>Pendiente de apertura</small>
                  </div>
                  <span class="ms-auto badge bg-secondary-subtle text-secondary">Pendiente</span>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="stage">
                  <span class="dot"></span>
                  <div>
                    <div class="fw-semibold">Reportes & Certificados</div>
                    <small>Listas por área y nivel</small>
                  </div>
                  <span class="ms-auto badge bg-secondary-subtle text-secondary">Pendiente</span>
                </div>
              </div>
            </div>

            <!-- Barra de progreso global -->
            <div class="mt-3">
              <div class="d-flex justify-content-between mb-1">
                <small class="text-muted">Avance total</small>
                <small class="text-muted fw-semibold">62%</small>
              </div>
              <div class="progress" role="progressbar" aria-label="Progreso total" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-primary" style="width:62%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="cardx anim">
          <div class="cardx-header">
            <h6 class="mb-0">Acciones rápidas</h6>
          </div>
          <div class="cardx-body d-flex flex-wrap gap-2">
            <a routerLink="/importaciones" class="btn btn-primary btn-round">
              <i class="bi bi-cloud-arrow-up"></i> Importar CSV
            </a>
            <a routerLink="/evaluaciones" class="btn btn-outline-primary btn-round">
              <i class="bi bi-clipboard2-check"></i> Ingresar notas
            </a>
            <a routerLink="/reportes" class="btn btn-outline-primary btn-round">
              <i class="bi bi-filetype-xlsx"></i> Generar reportes
            </a>
            <a routerLink="/configuracion" class="btn btn-outline-secondary btn-round">
              <i class="bi bi-gear"></i> Configuración
            </a>
          </div>
        </div>
      </div>

      <!-- Col derecha -->
      <div class="col-12 col-lg-4">
        <!-- Actividad reciente -->
        <div class="cardx anim mb-3">
          <div class="cardx-header">
            <h6 class="mb-0">Actividad reciente</h6>
          </div>
          <div class="cardx-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-semibold">Notas actualizadas – Física</div>
                  <small class="text-muted">Resp. Área • hace 12 min</small>
                </div>
                <span class="badge bg-light text-dark">+45</span>
              </li>
              <li class="list-group-item px-0 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-semibold">CSV importado – Robótica</div>
                  <small class="text-muted">Sistema • hoy 09:41</small>
                </div>
                <span class="badge bg-light text-dark">1,120</span>
              </li>
              <li class="list-group-item px-0 d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-semibold">Revisión de clasificados – Química</div>
                  <small class="text-muted">Comité • ayer</small>
                </div>
                <span class="badge bg-light text-dark">OK</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Próximos pasos -->
        <div class="cardx anim">
          <div class="cardx-header">
            <h6 class="mb-0">Próximos pasos</h6>
          </div>
          <div class="cardx-body">
            <div class="d-grid gap-2">
              <a routerLink="/clasificacion" class="btn btn-outline-primary btn-round">
                <i class="bi bi-list-check"></i> Revisar clasificados
              </a>
              <a routerLink="/final" class="btn btn-outline-primary btn-round">
                <i class="bi bi-flag"></i> Habilitar fase final
              </a>
              <a routerLink="/certificados" class="btn btn-outline-primary btn-round">
                <i class="bi bi-file-earmark-text"></i> Preparar certificados
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  `
})
export class DashboardComponent {
  loading = signal(false);
}
