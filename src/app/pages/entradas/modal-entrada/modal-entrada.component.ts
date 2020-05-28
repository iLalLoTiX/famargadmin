import { Component, Input, ViewChild } from '@angular/core';
import { Orden } from '../../../interfaces/orden.interface';
import { Subject } from 'rxjs';
import { GenOrdenComponent } from '../gen-orden/gen-orden.component';

@Component({
  selector: 'app-modal-entrada',
  templateUrl: './modal-entrada.component.html',
  styles: [
  ]
})
export class ModalEntradaComponent{

  @ViewChild(GenOrdenComponent) compGenOrd: GenOrdenComponent;

  @Input() public closeModal;

  public proveedorId;
  public proveedorNombre;
  public fecha;

  constructor(){
    this.fecha = new Date();
  }

  recibirProveedor($event){
    this.proveedorId = $event.id;
    this.proveedorNombre = $event.nombre;
  }

  salir(){
    this.closeModal.hide();
  }

  altaOrden(){
    
    this.compGenOrd.altaOrden();
  }

}
