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
    this.ar_.params.subscribe( a => {
      this.OrdenesService.recuperarOrdenProducto(a['id']).subscribe( b => { this.productoProveedor = b;});
      this.OrdenesService.recuperarOrden(a['id']).subscribe( c => 
        {
          this.infEntrada = c;
          this.fecha = new Date();
          this.OrdenesService.recuperarProveedor(c.data()['id']).subscribe( d => 
            {
              this.infProveedor = d;
            });
        });
    });
   }


}
