import { Component, Input } from '@angular/core';
import { proveedor } from '../../../interfaces/proveedores.interface';
import { NgForm} from '@angular/forms';
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-modal-proveedores',
  templateUrl: './modal-proveedores.component.html',
  styles: [
  ]
})
export class ModalProveedoresComponent{

  @Input() closeModal;
  
  @Input() idProveedor;

  @Input() public proveedor: proveedor = new proveedor();


  constructor(public ps_: ProveedoresService) { }

  agregarProveedor(form: NgForm){
    if (form.invalid){
      Object.values(form.controls).forEach(control => { control.markAsTouched(); });
      console.log(this.proveedor);
      console.log(this.idProveedor);
      return;
    }
    if (this.idProveedor === null){
      console.log(this.proveedor);
      console.log(this.idProveedor);
      this.ps_.agregarProveedor(this.proveedor);
      return;
    }
    else{
      console.log(this.proveedor);
      console.log(this.idProveedor);
      this.ps_.actualizarProveedor(this.idProveedor, this.proveedor);
      return;
    }
  }

  limpiar(form: NgForm){
    form.reset({
      pais: 'Mexíco',
      estado: 'Yucatán',
      factura: true
    });
  }

  salir(){
    this.closeModal.hide();
  }

}
