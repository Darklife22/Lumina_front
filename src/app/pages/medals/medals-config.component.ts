// src/app/pages/medals/medals-config.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedalsService } from '../../services/medals.service';
import { CommonModule } from '@angular/common';
import { MedalleroConfig } from '../../shared/types';

@Component({
  standalone: true,
  selector: 'app-medals-config',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <h5>Configuración de Medallero</h5>
      <div class="row g-3 mt-1">
        <div class="col-12 col-md-3">
          <label class="form-label">Área (ID)</label>
          <input class="form-control" type="number" [(ngModel)]="area_id">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Oro</label>
          <input class="form-control" type="number" [(ngModel)]="config.oros">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Plata</label>
          <input class="form-control" type="number" [(ngModel)]="config.platas">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Bronce</label>
          <input class="form-control" type="number" [(ngModel)]="config.bronces">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Menciones</label>
          <input class="form-control" type="number" [(ngModel)]="config.menciones">
        </div>
      </div>

      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-outline-primary" (click)="cargar()"><i class="bi bi-arrow-repeat"></i> Cargar</button>
        <button class="btn btn-primary" (click)="guardar()"><i class="bi bi-save"></i> Guardar</button>
      </div>

      <div *ngIf="msg" class="alert alert-success rounded-4 mt-3">{{msg}}</div>
    </div>
  </div>
  `
})
export class MedalsConfigComponent{
  area_id = 0;
  config: MedalleroConfig = { area_id: 0, oros: 1, platas: 1, bronces: 1, menciones: 0 };
  msg = '';
  constructor(private svc: MedalsService){}
  cargar(){ if(!this.area_id) return; this.svc.get(this.area_id).subscribe(cfg => this.config = cfg); }
  guardar(){ this.config.area_id = this.area_id; this.svc.set(this.config).subscribe(()=> this.msg='Configuración guardada'); }
}
