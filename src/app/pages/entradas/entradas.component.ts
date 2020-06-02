import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

// Interfaces
import { Orden } from '../../interfaces/orden.interface';

// Ngx Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrdenesService } from 'src/app/services/ordenes.service';

// SweetAlert
import swal from 'sweetalert';

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

  // Variables temporales
  public orden: Orden = new Orden();

  constructor(public OrdenesServices: OrdenesService,
              public router: Router) {
    this.OrdenesServices.ordenesRecientes().subscribe( a => {
      this.ordenesRecientes = a;
    });
  }

  verOrden(orden_: Orden){
    const url = this.router.createUrlTree(['/entrada']);
    window.open(`#/${url}/${orden_.id}`, '_blank');
  }

  obtenerOrden(orden_: Orden){
    this.orden = orden_;
  }
  
  crearOrden() {
    this.orden = new Orden();
    const url = this.router.createUrlTree(['/orden']);
    window.open(`#/${url}/nuevo`, '_blank');
  }

  editarOrden() {

    if (Object.keys(this.orden).length === 0)
    {
      swal({
        text: 'Debes seleccionar una orden',
        icon: 'info',
      });
      return;
    }else{
      const url = this.router.createUrlTree(['/orden']);
      window.open(`#/${url}/${this.orden.id}`, '_blank');
    }
  }

  borrarOrden(){
    if (Object.keys(this.orden).length === 0)
    {
      swal({
        text: 'Debes seleccionar una orden',
        icon: 'info',
      });
      return;
    }
    else{
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
