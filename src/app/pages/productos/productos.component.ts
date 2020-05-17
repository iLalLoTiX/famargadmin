import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { producto } from '../../interfaces/producto.interface';
import { FrutasServices } from '../../services/frutas.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  public tablaProductos;

  constructor(public _OS: FrutasServices ) {

    this._OS.cargarProductos().subscribe( a => { this.tablaProductos = a; });

  }

  borrar(id: string){
    this._OS.borrarProducto(id);
  }

  editar(id: string){
    console.log(id);
  }

}
