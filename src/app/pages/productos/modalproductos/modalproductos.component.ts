import { Component} from '@angular/core';
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

  producto = new producto;
  id: string;

  constructor( public fs_: FrutasServices ) {

  }

  agregarProducto(form: NgForm){
    this.fs_.agregarProducto(this.id, this.producto);
  }  

}
