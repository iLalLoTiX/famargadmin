import { Component, Input, } from '@angular/core';
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

  @Input() closeModal;
  
  @Input() idProductoRef;

  @Input() public productoRef: producto = new producto();


  constructor( public fs_: FrutasServices ) { }

  agregarProducto(form: NgForm){
    if (form.invalid){
      Object.values(form.controls).forEach(control => {control.markAsTouched();});
      return;
    }
    if (this.idProductoRef == null){
      this.fs_.agregarProducto(this.productoRef.id, this.productoRef);
      this.salir();
      return;
    }
    else{
      this.fs_.actualizarProducto(this.idProductoRef, this.productoRef);
      this.salir();
      return;
    }
  }

  salir(){
    this.closeModal.hide();
  }

}
