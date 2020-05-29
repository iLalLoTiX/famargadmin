import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

// Interfaces
import { Orden } from '../../interfaces/orden.interface';

// Ngx Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrdenesService } from 'src/app/services/ordenes.service';

// DatePipe
import localeEsAR from '@angular/common/locales/es-AR';

// SweetAlert
import swal from 'sweetalert';

registerLocaleData(localeEsAR, 'es-AR');
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

  // Variables temporales
  public orden: Orden = new Orden();

  constructor(public OrdenesServices: OrdenesService,
              private modalService: BsModalService,
              public router: Router) {
    this.OrdenesServices.ordenesRecientes().subscribe( a => {
      this.ordenesRecientes = a;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.orden = new Orden();
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  verOrden(id: string){
    const url = this.router.createUrlTree(['/entrada']);
    window.open(`#/${url}/${id}`, '_blank');
  }

  obtenerOrden(ordenObj: Orden){
    this.orden = ordenObj;
  }

  editarOrden(template: TemplateRef<any>) {
    
    if (Object.keys(this.orden).length === 0)
    {
      swal({
        text: 'Debes seleccionar una orden',
        icon: 'info',
      });
      return;
    }else{
      this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
  }

  borrarOrden(){
    if (this.orden === undefined)
    {
      swal({
        text: 'Debes seleccionar una orden',
        icon: 'info',
      });
      return;
    }
    else{
    console.log(this.orden);
    swal({
      title: 'Atencion!',
      text: 'Quieres borrar esta orden de compra: OC-' + this.orden.id + '?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.OrdenesServices.borrarOrden(this.orden.id);
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
    }
  }

}
