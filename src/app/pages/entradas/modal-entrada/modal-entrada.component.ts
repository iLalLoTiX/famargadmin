import { Component, Input, ViewChild, OnInit, EventEmitter, Output} from '@angular/core';

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

  @Output() ProveedorSeleccionado: EventEmitter<any>  = new EventEmitter();

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
      this.OrdenServices.recuperarOrdenProducto(this.ordenR.id).forEach( a => {
        let i = 0;
        a.forEach( b => {
          this.arrayProducto[i] = b.payload.doc.data();
          i++;
        });
      });
    }
  }

  recibirProveedor($event){
    this.ProveedorSeleccionado.emit($event);
    this.salir();
  }

  salir(){
    this.closeModal.hide();
  }

}
