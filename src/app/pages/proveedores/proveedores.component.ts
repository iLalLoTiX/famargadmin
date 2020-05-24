import { Component, TemplateRef } from '@angular/core';
import { proveedor } from '../../interfaces/proveedores.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent{

  proveedor = new proveedor;
  public proveedores;
  idProveedor: string;
  opcionSeleccionado: any[] = [];
  facturados: boolean;

  // Modal
  
  public closeResult = '';
  public modalRef: BsModalRef;

  constructor(public ps_: ProveedoresService, private modalService: BsModalService) {
    this.ps_.cargarProveeores().subscribe( a => {this.proveedores = a;});
    this.idProveedor=null;
    this.proveedor.pais = 'Mexíco';
    this.proveedor.estado = 'Yucatán';
    this.proveedor.factura = true;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.proveedor = new proveedor();
    this.idProveedor = null;
  }

  borrarProveedor(id: string){
    swal({
      title: 'Atencion?',
      text: 'Quieres eliminar este producto?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this.ps_.borrarProveedor(id);
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
    return;
  }

  editarProveedor(template: TemplateRef<any>, _proveedor: proveedor, id: string){
    this.proveedor = _proveedor;
    this.idProveedor = id;
    this.modalRef = this.modalService.show(template);
  }

}
