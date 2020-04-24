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

  constructor(public ps_: ProveedoresService) {
    this.ps_.cargarProveeores().subscribe( a => {this.proveedores = a;});
    this.idproveedor=null;
  }

  

  agregarProveedor(form: NgForm){
    
    if(this.idproveedor==null)
    {
      this.ps_.agregarProveedor(this.proveedor);
      form.reset();
    }
    else{
      this.ps_.actualizarProveedor(this.idproveedor, this.proveedor);
      form.reset();
    }
    
  }

  borrarProveedor(id: string){
    this.ps_.borrarProveedor(id);
  }

  mostrarProveedor(id: string){
    this.ps_.ponerProveedor(id).subscribe((a: any) => 
    {
      this.proveedor = a.data(),
      this.idproveedor = a.id;
    }
    );
  }

}
