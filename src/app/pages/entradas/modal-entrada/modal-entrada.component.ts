import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { GenOrdenComponent } from '../gen-orden/gen-orden.component';

// Sweetalert
import swal from 'sweetalert';
import { OrdenesService } from '../../../services/ordenes.service';
import { Orden } from '../../../interfaces/orden.interface';

@Component({
  selector: 'app-modal-entrada',
  templateUrl: './modal-entrada.component.html',
  styles: [
  ]
})
export class ModalEntradaComponent implements OnInit{

  @ViewChild(GenOrdenComponent) compGenOrd: GenOrdenComponent;

  @Input() public closeModal;

  @Input() public ordenR = new Orden();

  public arrayProducto: any [] = [];

  public proveedorId;
  public proveedorNombre;
  public fecha;

  constructor(public OrdenServices: OrdenesService){
    this.fecha = new Date();
  }

  ngOnInit(): void {
    if (Object.keys(this.ordenR).length !== 0){
      this.proveedorId = this.ordenR.idProveedor;
      this.proveedorNombre = this.ordenR.nombreProveedor;
      this.OrdenServices.recuperarOrdenProducto(this.ordenR.id).forEach( a =>{
        let i = 0;
        a.forEach( b => {
          this.arrayProducto[i] = b.payload.doc.data();
          console.log(this.arrayProducto[i]);
          i++;
        });
        this.arrayProducto.forEach( c => console.log(c));
      });
    }
  }

  recibirProveedor($event){
    this.proveedorId = $event.id;
    this.proveedorNombre = $event.nombre;
  }

  salir(){
    this.closeModal.hide();
  }

  altaOrden(){
    swal({
      title: 'Atencion',
      text: 'Quieres crear esta orden de compra?',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

        this.compGenOrd.altaOrden();
        this.salir();
        swal('Listo!', {
          icon: 'success',
        });

      } else {
        swal('No han habido cambios...');
      }
    });
  }

}
