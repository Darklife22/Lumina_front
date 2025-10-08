// src/app/core/user-types.ts
export type Role = 'admin' | 'coordinador' | 'evaluador' | 'invitado';

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  role: Role;   // ← viene del backend
  token: string;
}
