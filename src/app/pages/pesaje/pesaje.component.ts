import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-pesaje',
  templateUrl: './pesaje.component.html',
  styleUrls: ['./pesaje.component.css']
})
export class PesajeComponent implements OnInit {

  forma: FormGroup;
  arreglo: FormGroup;
  public pedido;

  constructor(private fb: FormBuilder) { 

    this.crearFormulario();
    this.crearArreglo();
    this.escucharPedido();
    this.escucharMerma();
  }

  ngOnInit(): void {
  }

get tarimas()
{
  return this.arreglo.get('tarimas') as FormArray;
}
  crearFormulario(){
    this.forma = this.fb.group({
      pedido : [, Validators.required],
      merma  : [, Validators.required],
      kilosEx: [, Validators.required],
      total  : [,]
    });
  }

  crearArreglo(){
    this.arreglo = this.fb.group({
      tarimas: this.fb.array([
          this.fb.group({
            tarima: [, Validators.required ],
            cajas: [, Validators.required ],
            peso: [, Validators.required ],
            bascula: [, Validators.required ],
            destarado: [, Validators.required ],
        }),
      ])
    });
  }

  agregarTarima(){
    this.tarimas.push(this.fb.group(
      {
        tarima: [, Validators.required ],
        cajas: [, Validators.required ],
        peso: [, Validators.required ],
        bascula: [, Validators.required ],
        destarado: [, Validators.required ],
      }
    ));
  }

  borrarTarima(i){
    this.tarimas.removeAt(i);
  }

  escucharPedido() {
    this.pedido = this.forma.get('pedido').valueChanges.subscribe( (pedido: number) => {
      console.log(this.forma.value.merma = pedido * 0.05);
      console.log(this.forma.value.kilosEx = Math.floor(pedido / 100));
      console.log(this.forma.value.total = this.forma.value.kilosEx + pedido + this.forma.value.merma);
      
      this.forma.patchValue({
        merma  : [this.forma.value.merma],
        kilosEx: [this.forma.value.kilosEx],
        total  : [this.forma.value.total]
      });
      
    });
  }

  escucharMerma(){
    this.pedido = this.forma.get('merma').valueChanges.subscribe( (merma: number) => {
      console.log(this.forma.value.kilosEx = Math.floor(this.forma.value.pedido / 100));
      console.log(this.forma.value.total = this.forma.value.kilosEx + this.forma.value.pedido + merma);
      
      this.forma.patchValue({
        kilosEx : [this.forma.value.kilosEx],
        total   : [this.forma.value.total]
      });
      
    });
  }

  guardar(){
    console.log(this.tarimas.controls.length); 
    this.tarimas.controls.forEach(element => {


      // tslint:disable-next-line: max-line-length
      element.value.bascula  = (this.forma.value.pedido / this.tarimas.controls.length) + ((element.value.tarima) + (element.value.cajas * element.value.peso));

      element.setValue(
        {
          tarima: element.value.tarima,
          cajas: element.value.cajas,
          peso: element.value.peso,
          bascula: element.value.bascula,
          destarado: element.value.bascula -  ((element.value.tarima) + (element.value.cajas * element.value.peso)),
        }
      );
    });
  }
}
