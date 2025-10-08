// src/app/pages/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AuthUser } from '../../core/user-types';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  styles: [`
    :host { display:block; }
    /* Fondo oscuro con gradiente */
    .auth-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #0b1f46 0%, #13366f 55%, #1a55a9 100%);
      display:flex; align-items:center; justify-content:center;
      padding: 1.25rem;
    }
    /* Animaciones sutiles */
    @keyframes fadeUp {
      from { opacity:0; transform: translateY(8px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes floatPulse {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    .shell {
      max-width: 1000px; width:100%;
      border-radius: 1.25rem; overflow: hidden;
      box-shadow: 0 1.25rem 3rem rgba(0,0,0,.25);
      animation: fadeUp .45s ease-out both;
    }

    /* Panel izquierdo: formulario */
    .pane-form {
      background: #ffffff;
      padding: 2rem 1.5rem;
    }
    @media (min-width: 992px) { .pane-form { padding: 2.75rem 2.5rem; } }

    .brand { display:flex; align-items:center; gap:.6rem; margin-bottom: .5rem; }
    .brand i { font-size: 1.6rem; color:#0f3f94; animation: floatPulse 3s ease-in-out infinite; }
    .brand strong { font-weight: 700; letter-spacing:.2px; }

    .form-control { border-radius: .9rem; }
    .input-group .form-control { border-top-right-radius: 0; border-bottom-right-radius: 0; }
    .input-group .btn { border-top-left-radius: 0; border-bottom-left-radius: 0; }

    .btn-primary { background-color:#0f3f94; border-color:#0f3f94; transition: transform .15s ease; }
    .btn-primary:hover { background-color:#0d3580; border-color:#0d3580; transform: translateY(-1px); }

    /* Panel derecho: info (solo lg+) */
    .pane-aside {
      background:
        radial-gradient(800px 300px at 100% 0%, rgba(255,255,255,0.10), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      color: #f8f9fa;
      display:none; align-items:center; justify-content:center;
      padding: 2rem;
    }
    @media (min-width: 992px) { .pane-aside { display:flex; } }

    .aside-inner { max-width: 440px; }
    .aside-title { font-weight: 800; letter-spacing:.3px; margin-bottom:.25rem; }
    .aside-sub { opacity:.9; margin-bottom: 1rem; }
    .aside-list { margin: 0 0 1.25rem 0; padding: 0; list-style: none; }
    .aside-list li { display:flex; gap:.5rem; margin:.35rem 0; }
    .aside-badge { background:#ffffff; color:#0b1f46; border-radius: 999px; padding:.25rem .5rem; font-size:.75rem; font-weight:600; display:inline-block; }
    .aside-foot { opacity:.8; font-size:.85rem; }
  `],
  template: `
    <div class="auth-bg">
      <div class="shell">
        <div class="row g-0">
          <!-- Formulario -->
          <div class="col-12 col-lg-6 pane-form">
            <div class="brand">
                <img src="/logo/logo.png" alt="Logo Lumina" class="img-fluid" style="height: 40px;">
                <strong>Oh! SanSi</strong>
            </div>

            <p class="text-muted mb-4">Accede para gestionar evaluaciones y reportes.</p>

            <form #f="ngForm" (ngSubmit)="login(f)" class="d-grid gap-3" novalidate>
              <div>
                <label for="email" class="form-label">Correo</label>
                <input id="email" type="email" class="form-control"
                  [(ngModel)]="email" name="email" required email
                  [class.is-invalid]="f.submitted && emailCtl.invalid"
                  #emailCtl="ngModel" autocomplete="email" />
                <div class="invalid-feedback" *ngIf="f.submitted && emailCtl.errors">
                  <span *ngIf="emailCtl.errors['required']">El correo es obligatorio.</span>
                  <span *ngIf="emailCtl.errors['email']">Formato de correo inválido.</span>
                </div>
              </div>

              <div>
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <input id="password"
                         [type]="showPassword ? 'text' : 'password'"
                         class="form-control"
                         [(ngModel)]="password" name="password" required minlength="4"
                         [class.is-invalid]="f.submitted && passCtl.invalid"
                         #passCtl="ngModel" autocomplete="current-password" />
                  <button type="button" class="btn btn-outline-secondary"
                          (click)="showPassword = !showPassword"
                          [attr.aria-pressed]="showPassword">
                    <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
                <div class="invalid-feedback d-block" *ngIf="f.submitted && passCtl.errors">
                  <span *ngIf="passCtl.errors['required']">La contraseña es obligatoria.</span>
                  <span *ngIf="passCtl.errors['minlength']">Mínimo 4 caracteres.</span>
                </div>
              </div>

              <div *ngIf="error()" class="alert alert-danger rounded-4 py-2">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error() }}
              </div>

              <button class="btn btn-primary rounded-4 py-2" [disabled]="loading() || f.invalid">
                <span *ngIf="!loading()"><i class="bi bi-box-arrow-in-right me-1"></i> Entrar</span>
                <span *ngIf="loading()" class="d-inline-flex align-items-center">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Verificando...
                </span>
              </button>
            </form>
          </div>

          <!-- Aside informativo (lg+) -->
          <div class="col-lg-6 pane-aside">
            <div class="aside-inner">
              <div class="mb-2">
                <span class="aside-badge">Olimpiada Oh! SanSi</span>
              </div>
              <h3 class="aside-title">Evaluación ágil y confiable</h3>
              <p class="aside-sub">
                Plataforma web para registrar evaluaciones, generar clasificados y premiados,
                y producir listas para certificados, premiación y sitio oficial (por área y nivel). :contentReference[oaicite:0]{{ '{' }}index=0{{ '}' }}
              </p>
              <ul class="aside-list">
                <li><i class="bi bi-check2-circle"></i> Registro de evaluadores y responsables por área.</li>
                <li><i class="bi bi-check2-circle"></i> Notas en números reales; clasificación por fases.</li>
                <li><i class="bi bi-check2-circle"></i> Reordenamiento de listas y cierre de evaluación.</li>
                <li><i class="bi bi-check2-circle"></i> Parametrización de medallero y log de cambios.</li>
                <li><i class="bi bi-check2-circle"></i> Exportación a Excel y diseño responsive.</li>
              </ul>
              <div class="aside-foot">
                 Lumina solutions SRL <br>admin&#64;example.com <br>secret123
              </div>
              <div class="aside-foot">
                <br>eval&#64;ohsansi.local <br>SecretTemp123!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;

  loading = signal(false);
  error = signal('');

  login(f: NgForm) {
    if (f.invalid) return;
    this.loading.set(true); this.error.set('');

    this.api.post<{user:{id:number; nombre:string; email:string; role:string}, token:string}>('/login', {
      email: this.email, password: this.password
    }).subscribe({
      next: res => {
        const u: AuthUser = { ...res.user, token: res.token } as AuthUser;
        this.auth.setUser(u);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
        this.loading.set(false);
      },
      error: () => { this.error.set('Credenciales inválidas'); this.loading.set(false); }
    });
  }
}
