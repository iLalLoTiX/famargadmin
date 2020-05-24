import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntradasService } from 'src/app/services/entradas.service';
import { producto } from '../../../interfaces/producto.interface';

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
              public es_: EntradasService) {
    this.ar_.params.subscribe( a => {
      this.es_.productoEntrante(a['id']).subscribe( b => { this.productoProveedor = b; });
      this.es_.recuperarEntrada(a['id']).subscribe( c => 
        {
          this.infEntrada = c;
          this.fecha = new Date();
          console.log(this.fecha);
          this.es_.recuperarProveedor(c.data()['idNombreProveedor']).subscribe( d => 
            {
              this.infProveedor = d;
            });
        });
    });
   }


}
