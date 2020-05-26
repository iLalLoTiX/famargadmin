import { Component, Input } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { Clientes } from '../../../interfaces/clientes.interface';
import { NgForm} from '@angular/forms';

@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styles: [
  ]
})
export class ModalClientesComponent{

  @Input() closeModal;

  @Input() idClienteRef;

  @Input() public clienteRef: Clientes = new Clientes();


  constructor( public clis_: ClientesService ) { }
  agregarCliente(form: NgForm){
    if (form.invalid){
      Object.values(form.controls).forEach(control => { control.markAsTouched(); });
      return;
    }
    if (this.idClienteRef == null){
      this.clis_.agregarCliente(this.clienteRef);
      this.salir();
      return;
    }
    else{
      this.clis_.actualizarCliente(this.idClienteRef, this.clienteRef);
      this.salir();
      return;
    }
  }

  salir(){
    this.closeModal.hide();
  }
}
