import { Component, Output, EventEmitter} from '@angular/core';
import { ProveedoresService } from '../../../services/proveedores.service';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { proveedor } from '../../../interfaces/proveedores.interface';

@Component({
  selector: 'app-select-proveedor',
  templateUrl: './select-proveedor.component.html',
  styles: [
  ]
})
export class SelectProveedorComponent{

  @Output() ProveedorSeleccionado: EventEmitter<any>  = new EventEmitter();

  public mostrarProveedores;

  constructor(private Ps: ProveedoresService) {

    this.Ps.cargarProveeores().subscribe(a => { this.mostrarProveedores = a; });
  }

  seleccionarProveedor(proveedor_: proveedor){

    this.ProveedorSeleccionado.emit(proveedor_);

  }

}
