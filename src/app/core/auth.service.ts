// src/app/core/auth.service.ts  (sin cambios funcionales; usa el role del backend)
import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, Role } from './user-types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.restore());
  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());
  role = computed<Role | null>(() => this._user()?.role ?? null);

  private restore(): AuthUser | null {
    try { const raw = localStorage.getItem('auth_user'); return raw ? JSON.parse(raw) as AuthUser : null; }
    catch { return null; }
  }
  private persist(u: AuthUser | null){
    if(u) localStorage.setItem('auth_user', JSON.stringify(u));
    else localStorage.removeItem('auth_user');
  }

  setUser(u: AuthUser){ this._user.set(u); this.persist(u); }
  logout(){ this._user.set(null); localStorage.removeItem('auth_user'); localStorage.removeItem('token'); }
  hasRole(roles: Role[]){ const r = this.role(); return !!r && roles.includes(r); }
}
