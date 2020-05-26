import { Component, ViewChild, TemplateRef } from '@angular/core';
import { caja } from '../../interfaces/cajas.interface';
import { CajasService } from 'src/app/services/cajas.service';
import { TabsetComponent, } from 'ngx-bootstrap/tabs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
})
export class CajasComponent{
  @ViewChild('tabset') tabset: TabsetComponent;

  public caja = new caja;
  public cajas;
  public idCaja;
  public cajasTotales: number;
  public closeResult = '';
  public modalRef: BsModalRef;

  constructor(public cs_: CajasService, private modalService: BsModalService) {
    this.cs_.cargarCajas().subscribe( a => {this.cajas = a ; });
    this.cajasTotales = this.cs_.B;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.caja = new caja();
    this.idCaja = null;
  }

  borrarCaja(id: string){
    swal({
      title: 'Atencion?',
      text: 'Quieres eliminar este producto?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this.cs_.borrarCaja(id);
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
  }

  editarCaja(template: TemplateRef<any>, _caja: caja, id: string){

    this.caja = _caja;
    this.idCaja = id;
    this.modalRef = this.modalService.show(template);
  }

}
