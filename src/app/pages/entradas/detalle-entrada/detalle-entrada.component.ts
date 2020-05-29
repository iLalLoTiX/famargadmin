import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../../../interfaces/producto.interface';
import { OrdenesService } from '../../../services/ordenes.service';

@Component({
  selector: 'app-detalle-entrada',
  templateUrl: './detalle-entrada.component.html',
  styles: [
  ]
})
export class DetalleEntradaComponent{

  public productoProveedor;
  public infProveedor;
  public infEntrada;
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
        this.infEntrada = c;
        this.fecha = new Date();
        this.OrdenesService.recuperarProveedor(c.data()['id']).subscribe( d => 
          {
            this.infProveedor = d;
          });
      });
   }


}
