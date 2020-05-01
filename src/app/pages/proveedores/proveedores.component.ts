import { Component } from '@angular/core';
import { proveedor } from '../../interfaces/proveedores.interface';
import { NgForm} from '@angular/forms';  
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent{

  proveedor = new proveedor;
  public proveedores;
  idproveedor: string;
  opcionSeleccionado: any[] = [];
  facturados: boolean;
  

  constructor(public ps_: ProveedoresService) {
    this.ps_.cargarProveeores().subscribe( a => {this.proveedores = a;});
    this.idproveedor=null;
    this.proveedor.pais = 'Mexíco';
    this.proveedor.estado = 'Yucatán';
    this.proveedor.factura = true;
  }

  

  agregarProveedor(form: NgForm){
    if(form.invalid){
      Object.values(form.controls).forEach(control => {control.markAsTouched();});
      return;
    }
    if(this.idproveedor==null){
      this.ps_.agregarProveedor(this.proveedor);
      this.limpiar(form);
      return;
    }
    else{
      this.ps_.actualizarProveedor(this.idproveedor, this.proveedor);
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


  borrarProveedor(id: string){
    this.ps_.borrarProveedor(id);
    return;
  }

  mostrarProveedor(id: string){
    this.ps_.ponerProveedor(id).subscribe((a: any) => 
    {
      this.proveedor = a.data(),
      this.idproveedor = a.id;
    }
    );
    return;
  }

}
