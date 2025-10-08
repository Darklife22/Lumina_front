// src/app/pages/reports/reports.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <h5>Reportes</h5>
      <div class="row g-3 mt-1">
        <div class="col-12 col-md-4">
          <label class="form-label">Área (ID)</label>
          <input class="form-control" type="number" [(ngModel)]="area_id">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Nivel (ID)</label>
          <input class="form-control" type="number" [(ngModel)]="nivel_id">
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2 mt-3">
        <button class="btn btn-primary" (click)="certificados()"><i class="bi bi-filetype-xlsx"></i> Lista para Certificados</button>
        <button class="btn btn-outline-primary" (click)="ceremonia()"><i class="bi bi-easel2"></i> Lista para Ceremonia</button>
        <button class="btn btn-outline-primary" (click)="publicacion()"><i class="bi bi-globe"></i> Lista para Web</button>
      </div>

      <div *ngIf="message" class="alert alert-success rounded-4 mt-3">
        {{message}}
      </div>
    </div>
  </div>
  `
})
export class ReportsComponent{
  area_id = 0; nivel_id=0; message='';
  constructor(private svc: ReportsService){}
  certificados(){ this.svc.certificados(this.area_id, this.nivel_id).subscribe(()=> this.message='Generado: Certificados'); }
  ceremonia(){ this.svc.ceremonia(this.area_id, this.nivel_id).subscribe(()=> this.message='Generado: Ceremonia'); }
  publicacion(){ this.svc.publicacion(this.area_id, this.nivel_id).subscribe(()=> this.message='Generado: Publicación'); }
}
