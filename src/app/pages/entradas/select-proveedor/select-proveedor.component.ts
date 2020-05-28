import { Component, Output, EventEmitter} from '@angular/core';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-select-proveedor',
  templateUrl: './select-proveedor.component.html',
  styles: [
  ]
})
export class SelectProveedorComponent{

  @Output() ProveedorSeleccionado: EventEmitter<any>  = new EventEmitter();

  @Output() ProveedorSeleccionadoNombre: EventEmitter<string>  = new EventEmitter();

  public mostrarProveedores;

  constructor(private Ps: ProveedoresService) {

    this.Ps.cargarProveeores().subscribe(a => { this.mostrarProveedores = a; });
  }

  seleccionarProveedor(id_: string, nombre_: string){

    this.ProveedorSeleccionado.emit({id: id_, nombre: nombre_});

  }

}
