import { Component, OnInit } from '@angular/core';
import { EntradasService } from 'src/app/services/entradas.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html'
})
export class EntradasComponent implements OnInit {

  // Array Entradas recientes
  public entradasRecientes;

  constructor( public es_: EntradasService) { 
    this.es_.entradasRecientes().subscribe( a => {
      this.entradasRecientes = a;
    });
  }

  ngOnInit(): void {
  }

}
