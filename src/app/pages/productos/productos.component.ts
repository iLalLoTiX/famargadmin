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

  public producto: producto = new producto();
  public closeResult = '';
  public idProducto: string;
  public modalRef: BsModalRef;

  constructor(public _OS: FrutasServices, private modalService: BsModalService ) {

    this._OS.cargarProductos().subscribe( a => {
      this.tablaProductos = a;
    });

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    this.producto = new producto();
    this.idProducto = null;
  }

  borrar(){
    if (Object.keys(this.producto).length === 0){
      swal({
        text: 'Debes seleccionar un producto',
        icon: 'info',
      });
      return;
    }else{
      swal({
        title: 'Atencion',
        text: 'Quieres eliminar este producto?',
        icon: 'warning',
        buttons: ['Cancelar', true],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this._OS.borrarProducto(this.producto.id);
          this.producto = new producto();
          swal('Listo!', {
            icon: 'success',
          });
        } else {
          swal('No han habido cambios...');
          this.producto = new producto();
        }
      });
    }
  }

  editar(template: TemplateRef<any>){
    console.log(Object.keys(this.producto).length);
    if (Object.keys(this.producto).length === 0)
    {
      swal({
        text: 'Debes seleccionar un producto',
        icon: 'info',
      });
      return;
    }else{
      this.idProducto = this.producto.id;
      this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
  }

  obtenerProducto(_producto: producto){

    this.producto = _producto;

  }


}
