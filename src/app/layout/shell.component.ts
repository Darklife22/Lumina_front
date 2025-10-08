// src/app/layout/shell.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HasRoleDirective } from '../shared/has-role.directive';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HasRoleDirective],
  styles: [`
    :host { display:block; }

    /* Layout base: NO cambia estructura, solo estilos */
    .wrapper {
      min-height: 100vh;
      display: flex;
      background: #f6f8fb;
    }

    /* Sidebar fijo de ancho, scroll propio, sin afectar main */
    .sidebar {
      width: 260px;
      flex: 0 0 260px;
      background: linear-gradient(160deg, #0c1f49, #1b56ad);
      color: #fff;
      border-right: 1px solid rgba(255,255,255,.08);
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: auto;
    }

    /* Marca */
    .sidebar .navbar-brand {
      color: #fff;
      font-weight: 800;
      letter-spacing: .2px;
      text-decoration: none;
    }
    .sidebar .navbar-brand i { color: #cfe0ff !important; }

    /* Texto auxiliar en sidebar */
    .sidebar small.text-muted {
      color: rgba(255,255,255,.75) !important;
    }

    /* Nav clásico pill, con hover/active suaves */
    .sidebar .nav .nav-link {
      color: #cfe0ff;
      border-radius: .75rem;
      padding: .55rem .75rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      transition: background-color .15s ease, transform .1s ease;
    }
    .sidebar .nav .nav-link:hover {
      background: rgba(255,255,255,.08);
      transform: translateX(2px);
      color: #ffffff;
    }
    .sidebar .nav .nav-link.active {
      background: rgba(255,255,255,.16);
      color: #ffffff;
      font-weight: 600;
    }
    .sidebar .nav .nav-link i { opacity: .95; }

    /* Tarjeta de usuario al pie */
    .sidebar .bg-primary-subtle {
      background: rgba(255,255,255,.12) !important;
      color: #eaf0ff;
      border: 1px solid rgba(255,255,255,.15);
    }
    .sidebar .bg-primary-subtle .text-muted {
      color: rgba(255,255,255,.8) !important;
    }
    .sidebar .btn.btn-outline-primary {
      --bs-btn-color: #ffffff;
      --bs-btn-border-color: rgba(255,255,255,.6);
      --bs-btn-hover-color: #0c1f49;
      --bs-btn-hover-bg: #ffffff;
      --bs-btn-hover-border-color: #ffffff;
      --bs-btn-active-color: #0c1f49;
      --bs-btn-active-bg: #ffffff;
      --bs-btn-active-border-color: #ffffff;
      border-radius: .6rem;
    }

    /* Main */
    main { flex: 1 1 auto; padding: 1rem; }
    @media (min-width: 992px) { main { padding: 1.25rem 1.5rem; } }
  `],
  template: `
  <div class="wrapper">
    <aside class="sidebar d-flex flex-column gap-2 p-3">
      <a class="navbar-brand d-flex align-items-center gap-2 mb-2" routerLink="/">
        <img src="/logo/logo.png" alt="Lumina logo" style="width: 40px;">
        <span>Oh! SanSi</span>
      </a>
      <small class="text-muted mb-2">Panel de gestión</small>

      <nav class="nav nav-pills flex-column">
        <a class="nav-link d-flex align-items-center gap-2"
           routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <i class="bi bi-speedometer2"></i> Dashboard
        </a>

        <!-- Admin/Coordinador -->
        <ng-container *appHasRole="['admin','coordinador']">
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/importaciones" routerLinkActive="active">
            <i class="bi bi-cloud-arrow-up"></i> Importaciones
          </a>
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/evaluadores" routerLinkActive="active">
            <i class="bi bi-people"></i> Evaluadores
          </a>
        </ng-container>

        <!-- Evaluaciones (visible a todos los perfiles que lo usan) -->
        <ng-container *appHasRole="['admin','coordinador','evaluador']">
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/evaluaciones" routerLinkActive="active">
            <i class="bi bi-clipboard2-check"></i> Evaluaciones
          </a>
        </ng-container>

        <!-- Solo Evaluador: Registro de Evaluaciones (HU-03) -->
        <ng-container *appHasRole="['evaluador']">
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/registro-evaluaciones" routerLinkActive="active">
            <i class="bi bi-journal-check"></i> Registro de Evaluaciones
          </a>
        </ng-container>

        <!-- Admin/Coordinador -->
        <ng-container *appHasRole="['admin','coordinador']">
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/clasificacion" routerLinkActive="active">
            <i class="bi bi-diagram-3"></i> Clasificación
          </a>
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/final" routerLinkActive="active">
            <i class="bi bi-trophy"></i> Final
          </a>
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/reportes" routerLinkActive="active">
            <i class="bi bi-filetype-xlsx"></i> Reportes
          </a>
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/flujo" routerLinkActive="active">
            <i class="bi bi-check2-circle"></i> Flujo
          </a>
        </ng-container>

        <!-- Solo Admin -->
        <ng-container *appHasRole="['admin']">
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/medallero" routerLinkActive="active">
            <i class="bi bi-award"></i> Medallero
          </a>
          <a class="nav-link d-flex align-items-center gap-2" routerLink="/auditoria" routerLinkActive="active">
            <i class="bi bi-clock-history"></i> Auditoría
          </a>
        </ng-container>
      </nav>

      <div class="mt-auto">
        <div class="p-3 rounded-4 bg-primary-subtle d-flex align-items-center justify-content-between">
          <div class="small">
            <div class="fw-semibold">{{ auth.user()?.nombre }}</div>
            <div class="text-muted text-capitalize">{{ auth.role() || '—' }}</div>
          </div>
          <button class="btn btn-outline-primary btn-sm" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>
    </aside>

    <main class="p-3 p-lg-4">
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
export class ShellComponent {
  auth = inject(AuthService);
  logout(){ this.auth.logout(); location.href = '/login'; }
}
