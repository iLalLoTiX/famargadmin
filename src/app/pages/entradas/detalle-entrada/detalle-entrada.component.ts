import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../../../services/ordenes.service';
import { proveedor } from '../../../interfaces/proveedores.interface';
import { Orden } from '../../../interfaces/orden.interface';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-detalle-entrada',
  templateUrl: './detalle-entrada.component.html',
  styles: [
  ]
})
export class DetalleEntradaComponent{

  public productoProveedor;
  public infProveedor = new Array();
  public infOrden: Orden = new Orden();
  public idGen;
  public cosa: string;
  public fecha;

  constructor(public ar_: ActivatedRoute,
              public OrdenesService: OrdenesService) {
    let idParam;
    this.ar_.params.forEach( a => {
      idParam = a['id'];
    });
    this.OrdenesService.recuperarOrdenProducto(idParam).forEach( b => {
      this.productoProveedor = b;
    });
    this.OrdenesService.recuperarOrden(idParam).forEach( c =>
      {
        this.infOrden.id              = c.data()['id'];
        this.infOrden.nombreProveedor = c.data()['nombreProveedor'];
        this.infOrden.idProveedor     = c.data()['idProveedor'];
        this.infOrden.estado          = c.data()['estado'];
        this.infOrden.fecha           = c.data()['fecha'];

        this.fecha = new Date().getTime();

        this.OrdenesService.recuperarProveedor(this.infOrden.idProveedor).subscribe( d => 
          {
            this.infProveedor.push(d.data());
          });
      });
   }


}
