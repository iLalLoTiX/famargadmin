import { Component, OnInit } from '@angular/core';
import { EntradasService } from 'src/app/services/entradas.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html'
})
export class EntradasComponent implements OnInit {

  // Array Entradas recientes
  public entradasRecientes;
  public productosRecientes;

  constructor( public es_: EntradasService) { 
    this.es_.entradasRecientes().subscribe( a => {
      this.entradasRecientes = a;
    });
  }

  hola(id: string){
    this.productosRecientes = null;
    this.es_.productoEntrante(id).subscribe( a => { 
      this.productosRecientes = a;
  });
    
  }

  ngOnInit(): void {
  }

}
