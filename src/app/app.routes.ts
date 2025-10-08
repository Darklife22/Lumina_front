// src/app/app.routes.ts  (igual que ya tenías: login público, resto protegido)
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const appRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', data:{roles:['admin','coordinador','evaluador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'importaciones', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/import-olympists/import-olympists.component').then(m => m.ImportOlympistsComponent) },
      { path: 'evaluadores', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/evaluators/evaluators.component').then(m => m.EvaluatorsComponent) },
      { path: 'evaluaciones', data:{roles:['admin','coordinador','evaluador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/evaluations/evaluations.component').then(m => m.EvaluationsComponent) },
      { path: 'clasificacion', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/classification/classification.component').then(m => m.ClassificationComponent) },
      { path: 'final', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/finals/finals.component').then(m => m.FinalsComponent) },
      { path: 'reportes', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'medallero', data:{roles:['admin']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/medals/medals-config.component').then(m => m.MedalsConfigComponent) },
      { path: 'auditoria', data:{roles:['admin']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/audit-log/audit-log.component').then(m => m.AuditLogComponent) },
      { path: 'flujo', data:{roles:['admin','coordinador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/workflow/workflow.component').then(m => m.WorkflowComponent) },
      { path: 'registro-evaluaciones', data:{roles:['evaluador']}, canActivate:[roleGuard],
        loadComponent: () => import('./pages/evaluator-grades/evaluator-grades.component').then(m => m.EvaluatorGradesComponent) },

    ]
  },
  { path: '**', redirectTo: '' }
];


