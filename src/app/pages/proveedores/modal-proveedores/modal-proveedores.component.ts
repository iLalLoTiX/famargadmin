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

  @Input() editarProveedor: proveedor = {
    nombreProveedor: null,
    rfc: null,
    pais: null,
    estado: null,
    ciudad: null,
    direccion: null,
    colonia: null,
    cp: null,
    factura: null,
  };
  @Input() idProveedor: string;


  proveedor = new proveedor;

  constructor(public ps_: ProveedoresService) { }

  agregarProveedor(form: NgForm){
    if (form.invalid){
      Object.values(form.controls).forEach(control => { control.markAsTouched(); });
      return;
    }
    if (this.idProveedor === null){
      this.ps_.agregarProveedor(this.proveedor);
      this.limpiar(form);
      return;
    }
    else{
      this.ps_.actualizarProveedor(this.idProveedor, this.proveedor);
      this.limpiar(form);
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

}
