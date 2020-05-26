import { Component, Input, OnInit} from '@angular/core';
import { caja } from 'src/app/interfaces/cajas.interface';
import { CajasService } from '../../../services/cajas.service';
import { NgForm} from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-modal-cajas',
  templateUrl: './modal-cajas.component.html',
  styles: [
  ]
})
export class ModalCajasComponent implements OnInit{

  @Input() public closeModal;

  @Input() public caja = new caja();

  @Input() public idCaja;

  

  constructor(public cs_ : CajasService) { }

  ngOnInit() {
  
  }

  agregarCaja(form: NgForm){
    if ((this.caja.afuera + this.caja.adentro) !== this.caja.cantidad){

      swal({
        title: 'Atencion',
        text: 'El total de cajas debe ser igual a la suma entre cajas en el inventario y cajas de viaje',
        icon: 'warning',
        buttons: ['OK', true],
      });
      return;
    }
    if (form.invalid){
      Object.values(form.controls).forEach(control => { control.markAsTouched(); });
      return;
    }
    if (this.idCaja === null){
      this.cs_.agregarCaja(this.caja);
      this.salir();
      return;
    }
    else{
      this.cs_.actualizarCaja(this.idCaja, this.caja);
      this.salir();
      return;
    }
  }

  salir(){
    this.closeModal.hide();
  }

}
