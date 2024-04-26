import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h5 class="modal-title text-center">Explora Nuestros Planes de Precios</h5>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header text-center">
              <h5 class="card-title">Plan Premium</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><strong>Característica 1:</strong> Soporte prioritario 24/7</li>
                <li><strong>Característica 2:</strong> Acceso a contenido exclusivo</li>
                <li><strong>Característica 3:</strong> Funcionalidades avanzadas</li>
                <li><strong>Precio:</strong> $99/mes</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header text-center">
              <h5 class="card-title">Plan Estándar</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><strong>Característica 1:</strong> Soporte técnico estándar</li>
                <li><strong>Característica 2:</strong> Acceso a funciones básicas</li>
                <li><strong>Característica 3:</strong> Actualizaciones regulares</li>
                <li><strong>Precio:</strong> $49/mes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="left-side">
        <button type="button" class="btn btn-default btn-link" (click)="activeModal.close('Close click')">Cerrar</button>
      </div>
    </div>
  `
})
export class NgbdModalContent {
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal.component.html'
})
export class NgbdModalComponent {
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
  }
}
