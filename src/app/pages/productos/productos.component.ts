import { Component, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { producto } from '../../interfaces/producto.interface';
import { FrutasServices } from '../../services/frutas.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  public tablaProductos;

  public producto: producto;
  public idProducto: string;
  public closeResult = '';
  public modalRef: BsModalRef;

  constructor(public _OS: FrutasServices, private modalService: BsModalService ) {

    this._OS.cargarProductos().subscribe( a => {
      this.tablaProductos = a;
    });

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.producto = new producto();
    this.idProducto = null;
  }

  borrar(id: string){
    swal({
      title: 'Atencion',
      text: 'Quieres eliminar este producto?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this._OS.borrarProducto(id);
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
  }

  editar(template: TemplateRef<any>, _producto: producto, id: string){
    this.producto = _producto;
    this.idProducto = id;
    this.modalRef = this.modalService.show(template);
  }


}
