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
  public merma;
  public kilosEx;
  B: number= 0;
  A: number= 0;
  totalFacturar: number = 0;
  totalTarimas: number = 0;
  totalCajas: number = 0;
  totalBascula: number = 0;
  totalDestarado: number = 0;
  Falta: number = 0;

  constructor(private fb: FormBuilder) { 

    this.crearFormulario();
    this.crearArreglo();
    this.escucharPedido();
  }

  ngOnInit(): void {
  }

  reiniciarForm(){

    this.forma.reset({
      pedido  : this.forma.get('pedido').value,
      kilosEx : this.forma.get('kilosEx').value,
      merma   : this.forma.get('merma').value,
      total   : this.forma.value.total
      }
    );
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
    this.pedido = this.forma.valueChanges.subscribe( (forma: number) => {

      
        if(this.forma.get('pedido').dirty && !this.forma.get('pedido').touched){
          forma['merma'] = forma['pedido'] * 0.05;
          forma['kilosEx'] = forma['pedido'] / 100;
          forma['total'] = forma['kilosEx'] + forma['pedido'] + forma['merma'];

          this.reiniciarForm();

        }

        if((this.forma.get('merma').dirty && !this.forma.get('merma').touched) || (this.forma.get('kilosEx').dirty && !this.forma.get('kilosEx').touched)){
          forma['total'] = forma['kilosEx'] + forma['pedido'] + forma['merma'];
          
          this.reiniciarForm();
        }
        
        this.forma.patchValue({
          merma  : forma['merma'],
          kilosEx: forma['kilosEx'],
          total  : forma['total'],
        }, {emitEvent: false});
    });
    
    
  }

  operacionTarima(){
    this.Falta = 0;
    this.totalFacturar = 0;
    this.totalBascula = 0;
    this.totalTarimas = 0;
    this.totalCajas = 0;
    this.totalDestarado = 0
    this.B = 0;
    this.A = 0;
    this.tarimas.controls.forEach(tarima => {
      
      this.A = tarima.get('bascula').value -  ((tarima.get('cajas').value) * (tarima.get('peso').value));
      this.A = this.A - tarima.get('tarima').value;
      tarima.patchValue(
      {
        destarado: this.A
      }, {emitEvent: false});
      this.totalTarimas = tarima.get('tarima').value + this.totalTarimas;
      this.totalCajas = tarima.get('cajas').value + this.totalCajas;
      this.totalBascula = tarima.get('bascula').value + this.totalBascula;
      this.totalDestarado = tarima.get('destarado').value + this.totalDestarado;
      this.totalFacturar = this.totalDestarado - ((this.totalDestarado)* 0.05) - this.forma.get('kilosEx').value;
      this.Falta = this.totalFacturar - this.forma.get('pedido').value;
    });
  }
  
}
