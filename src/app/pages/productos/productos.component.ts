import { Component} from '@angular/core';
import { NgForm} from '@angular/forms';
import { producto } from '../../interfaces/producto.interface';
import { FrutasServices } from '../../services/frutas.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  public tablaProductos;

  public editarProducto: producto = {
    id : '',
    producto: '',
    sat: '',
    inventario: 0,
  };
  public idProducto: string;

  constructor(public _OS: FrutasServices ) {

    this._OS.cargarProductos().subscribe( a => { this.tablaProductos = a; });
    console.log(this.editarProducto);

  }

  borrar(id: string){
    swal({
      title: "Atencion?",
      text: "Quieres eliminar este producto?",
      icon: "warning",
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this._OS.borrarProducto(id);
        swal("Listo!", {
          icon: "success",
        });

      } else {
        swal("No han habido cambios...");
      }
    });
  }

  editar(id: string){
    this._OS.editarProducto(id).subscribe(a => {

      this.editarProducto = {
        id: a.data()['id'],
        sku: a.data()['sku'],
        producto: a.data()['producto'],
        sat: a.data()['sat'],
        inventario: a.data()['inventario'],
      };
      this.idProducto = a.id;
    });
    
  }

}
