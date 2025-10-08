// src/app/pages/forbidden/forbidden.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  template: `
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-accent-subtle">
    <div class="card p-4 border-0 shadow-sm text-center rounded-4" style="max-width:460px">
      <i class="bi bi-shield-exclamation fs-1 text-primary"></i>
      <h4 class="mt-2">Acceso restringido</h4>
      <p class="text-muted">No tienes permisos para ver este contenido.</p>
      <a class="btn btn-primary" routerLink="/">Ir al inicio</a>
    </div>
  </div>
  `
})
export class ForbiddenComponent {}
