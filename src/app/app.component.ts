import { Component } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { OrdenServicio } from './servicios/ordenes.service';
import { orden } from './interfaces/orden.interface';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  mensaje: string = "";
  proyecto = new orden;
  
  opcionSeleccionado: any[] = [];
  public i;

  constructor(public _OS: OrdenServicio ) {

    this._OS.cargarTabla().subscribe( a => {this.i = a;});
  }

  guardar(form: NgForm){
    this._OS.agregarPedido(this.proyecto.mensaje)
  }

  actulizar(id:string, texto:string){
    this._OS.actualizarPedido(id, texto);
    this.opcionSeleccionado = [];
  }

  borrar(id:string){
    this._OS.borrarPedido(id);
  }

}
