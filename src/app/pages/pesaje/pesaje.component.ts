import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
import { element } from 'protractor';
import { CajasService } from 'src/app/services/cajas.service';
import { PdfMakeWrapper, Table } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts';

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
  B: number = 0;
  A: number = 0;
  producto: string;
  tienda: string;
  totalFacturar: number = 0;
  totalTarimas: number = 0;
  totalCajas: number = 0;
  totalBascula: number = 0;
  totalDestarado: number = 0;
  Falta: number = 0;

  public llenarCajasSelect;

  constructor(private fb: FormBuilder, public cs_: CajasService) { 

    this.crearFormulario();
    this.crearArreglo();
    this.escucharPedido();
    this.cs_.cargarCajas().subscribe(a => this.llenarCajasSelect = a);
  }

  ngOnInit(): void {
  }

  imprimir(){
    PdfMakeWrapper.setFonts(pdfFonts);
 
    const pdf = new PdfMakeWrapper();
    
    pdf.add('Tienda: ' + this.tienda);
    pdf.add('producto: ' + this.producto);
    pdf.add('Total a facturar: ' + this.totalFacturar);
    pdf.add('Total Destarado: ' + this.totalDestarado);
    pdf.add('Total de cajas: ' + this.totalCajas);
    
    
    // let B = new Table([
    //   [ 'Tarima', 'Cajas','Bascula','Destarado']
    // ]).end;
    // let C;
    // pdf.add( B);
    // this.tarimas.controls.forEach(tarima => {
    //   C = new Table([
    //     [ tarima.get('tarima').value, tarima.get('cajas').value, tarima.get('bascula').value, tarima.get('destarado').value]
        
    //   ]).widths([ 100 , 100 ]).end;
    //   pdf.add( C);
      
    // });
      
      
    pdf.create().open();
    this.tarimas.controls.forEach(tarima => {
      
      this.cs_.prueba(tarima.get('tipo').value, tarima.get('cajas').value);

    });
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
            tipo: [],
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
        tipo: [],
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
