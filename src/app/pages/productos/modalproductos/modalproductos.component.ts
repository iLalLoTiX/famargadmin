import { Component, Input } from '@angular/core';
import { NgForm} from '@angular/forms';
import { producto } from '../../../interfaces/producto.interface';
import { FrutasServices } from '../../../services/frutas.service';

@Component({
  selector: 'app-modalproductos',
  templateUrl: './modalproductos.component.html',
  styles: [
  ]
})
export class ModalproductosComponent{

  @Input() editarProducto: producto = {
    id : null,
    producto: null,
    sat: null,
    inventario: null,
  };
  @Input() idProducto: string;

  producto = new producto;

  constructor( public fs_: FrutasServices ) {
    
  }

  agregarProducto(form: NgForm){
    if (form.invalid){
      Object.values(form.controls).forEach(control => {control.markAsTouched();});
      return;
    }
    if (this.idProducto == null){
      this.fs_.agregarProducto(this.producto.id, this.producto);
      this.salir();
      return;
    }
    else{
      this.fs_.actualizarProducto(this.idProducto, this.producto);
      this.salir();
      return;
    }
  }

  salir(){
    this.editarProducto = {
      id : null,
      producto: null,
      sat: null,
      inventario: null,
    };
    this.idProducto = null;
  }

}
