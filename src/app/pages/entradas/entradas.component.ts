import { Component, TemplateRef } from '@angular/core';
import { EntradasService } from 'src/app/services/entradas.service';

// Ngx Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html'
})
export class EntradasComponent {

  // Modal
  public closeResult = '';
  public modalRef: BsModalRef;

  // Array Entradas recientes
  public entradasRecientes;
  public productosRecientes;

  constructor(public EntradasServices: EntradasService,
              private modalService: BsModalService) { 
    this.EntradasServices.entradasRecientes().subscribe( a => {
      this.entradasRecientes = a;
    });
  }

  hola(id: string){
    this.productosRecientes = null;
    this.EntradasServices.productoEntrante(id).subscribe( a => { 
      this.productosRecientes = a;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

}
