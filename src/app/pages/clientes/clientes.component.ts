import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClientesService } from 'src/app/services/clientes.service';
import swal from 'sweetalert';
import { Clientes } from '../../interfaces/clientes.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent{
  public tablaClientes;

  public cliente: Clientes;
  public idCliente: string;

  // Ngx
  public closeResult = '';
  public modalRef: BsModalRef;

  constructor(public cs_: ClientesService, private modalService: BsModalService ) {
    this.cs_.cargarClientes().subscribe( a => { this.tablaClientes = a; });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.cliente = new Clientes();
    this.idCliente = null;
  }

  borrarCliente(id: string){
    swal({
      title: 'Atencion',
      text: 'Quieres eliminar este producto?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this.cs_.borrarCliente(id);
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
  }

  editarCliente(template: TemplateRef<any>, _cliente: Clientes, id: string){
    this.cliente = _cliente;
    this.idCliente = id;
    this.modalRef = this.modalService.show(template);
  }

}
