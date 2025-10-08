// src/app/pages/evaluators/evaluators.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluatorsService } from '../../services/evaluators.service';
import { FormsModule } from '@angular/forms';
import { Evaluador } from '../../shared/types';

@Component({
  standalone: true,
  selector: 'app-evaluators',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container-fluid">
    <div class="card p-3">
      <div class="d-flex align-items-center justify-content-between">
        <h5 class="mb-0">Evaluadores</h5>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEval">
          <i class="bi bi-plus-lg"></i> Nuevo
        </button>
      </div>

      <div class="table-responsive mt-3">
        <table class="table align-middle">
          <thead><tr>
            <th>Nombre</th><th>Área</th><th>Contacto</th><th class="text-end">Acciones</th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let e of evaluadores">
              <td class="fw-semibold">{{e.nombre}}</td>
              <td><span class="badge badge-soft-primary">{{e.area_id}}</span></td>
              <td class="text-muted small">
                <i class="bi bi-envelope"></i> {{e.email || '—'}} <br>
                <i class="bi bi-telephone"></i> {{e.telefono || '—'}}
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" (click)="remove(e)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="modalEval" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4">
            <div class="modal-header">
              <h6 class="modal-title">Nuevo Evaluador</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <form (ngSubmit)="create()" class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Nombre</label>
                  <input class="form-control" [(ngModel)]="form.nombre" name="nombre" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Área (ID)</label>
                  <input class="form-control" [(ngModel)]="form.area_id" name="area_id" type="number" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input class="form-control" [(ngModel)]="form.telefono" name="telefono" />
                </div>
                <div class="col-12">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="form.email" name="email" />
                </div>
              </div>
              <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
  `
})
export class EvaluatorsComponent {
  private svc = inject(EvaluatorsService);
  evaluadores: Evaluador[] = [];
  form: Evaluador = { nombre: '', area_id: 0 };
  ngOnInit(){ this.load(); }
  load(){ this.svc.list().subscribe(res => this.evaluadores = res.data); }
  create(){
    this.svc.create(this.form).subscribe(() => { this.load(); (window as any).bootstrap?.Modal.getInstance(document.getElementById('modalEval')!)?.hide(); this.form = { nombre:'', area_id:0 }; });
  }
  remove(e: Evaluador){
    if(!e.id) return;
    if(confirm('¿Eliminar evaluador?')) this.svc.remove(e.id).subscribe(() => this.load());
  }
}
