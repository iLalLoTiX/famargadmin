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
  public pedido  ;
  public merma;
  public kilosEx;
  B: number= 0;
  totalFacturar: number = 0;
  Falta: number = 0;

  constructor(private fb: FormBuilder) { 

    this.crearFormulario();
    this.crearArreglo();
    this.escucharPedido();
    this.escucharMerma();
    this.escucharKiloEx();
  }

  ngOnInit(): void {
  }

  get tarimas()
  {
    return this.arreglo.get('tarimas') as FormArray;
  }
  crearFormulario(){
    this.forma = this.fb.group({
      pedido : [],
      merma  : [],
      kilosEx: [],
      total  : []
    });
  }

  crearArreglo(){
    this.arreglo = this.fb.group({
      tarimas: this.fb.array([
          this.fb.group({
            tarima: [],
            cajas: [],
            peso: [],
            bascula: [],
            destarado: [],
        }),
      ])
    });
  }

  agregarTarima(){
    this.tarimas.push(this.fb.group(
      {
        tarima: [],
        cajas: [],
        peso: [],
        bascula: [],
        destarado: [],
      }
    ));
  }

  borrarTarima(i){
    this.tarimas.removeAt(i);
  }

  escucharPedido() {
    this.pedido = this.forma.get('pedido').valueChanges.subscribe( (pedido: number) => {
      let total: number;
      this.forma.value.merma = pedido * 0.05;
      this.forma.value.kilosEx = pedido / 100;
      total = this.forma.value.kilosEx + pedido + this.forma.value.merma;
      console.log(this.forma.value.kilosEx);
      this.forma.patchValue({
        merma  : [this.forma.value.merma],
        kilosEx: [this.forma.value.kilosEx],
        total  : [total]
      });
      
    });
  }

  escucharMerma(){
    this.merma = this.forma.get('merma').valueChanges.subscribe( (merma: number) => {
      let total: number;
      let kEx: number= this.forma.value.kilosEx;
      let pedido: number = this.forma.value.pedido;
      let merma2: number = this.forma.value.merma;
      console.log(this.forma.value.kilosEx);
      console.log(this.forma.value.kilosEx, pedido, merma2);
      total = this.forma.value.kilosEx + pedido + merma2;
      console.log(total);
      this.forma.patchValue({
        total   : [total]
      });
      
    });
  }

  escucharKiloEx(){
    this.kilosEx = this.forma.get('kilosEx').valueChanges.subscribe( (kilosEx: number) => {
      
      this.forma.patchValue({
        total   : [this.forma.value.total]
      });
      
    });
  }

  guardar(){

    this.Falta = 0;
    this.totalFacturar = 0;
    this.B = 0;
    this.tarimas.controls.forEach(element => {
      let A = element.value.bascula -  ((element.value.tarima) + (element.value.cajas * element.value.peso));
      
      element.patchValue(
        {
          tarima: element.value.tarima,
          cajas: element.value.cajas,
          peso: element.value.peso,
          bascula: element.value.bascula,
          destarado: A,
        }
      );
      this.B = A + this.B;
      this.totalFacturar = this.B - ((this.B * 0.05) + 8);
      
    });
    this.Falta = this.forma.value.pedido - this.totalFacturar;
  }
}
