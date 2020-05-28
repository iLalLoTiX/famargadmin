import { Component, TemplateRef } from '@angular/core';
import { EntradasService } from 'src/app/services/entradas.service';

// Ngx Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrdenesService } from 'src/app/services/ordenes.service';
@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html'
})
export class EntradasComponent {

  // Modal
  public closeResult = '';
  public modalRef: BsModalRef;

  // Array Entradas recientes
  public ordenesRecientes;
  public productosRecientes;

  constructor(public OrdenesServices: OrdenesService,
              private modalService: BsModalService) { 
    this.OrdenesServices.ordenesRecientes().subscribe( a => {
      this.ordenesRecientes = a;
    });
  }

  hola(id: string){
    this.productosRecientes = null;
    this.OrdenesServices.productoEntrante(id).subscribe( a => { 
      this.productosRecientes = a;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

}
