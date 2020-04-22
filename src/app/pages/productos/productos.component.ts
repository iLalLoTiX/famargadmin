import { Component } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { producto } from '../../interfaces/producto.interface';
import { FrutasServices } from '../../services/frutas.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  mensaje: string = "";
  proyecto = new producto;
  
  opcionSeleccionado: any[] = [];
  public i;

  constructor(public _OS: FrutasServices ) {

    this._OS.cargarTabla().subscribe( a => {this.i = a;});
  }


  agregarFruta(form: NgForm){
    this._OS.agregarPedido(this.proyecto.idInterno,
                            this.proyecto.sku,
                            this.proyecto.producto,
                            this.proyecto.categoria,
                            this.proyecto.sat,);
  }

  borrar(id:string){
    this._OS.borrarPedido(id);
  }

}
