import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-modal-entrada',
  templateUrl: './modal-entrada.component.html',
  styles: [
  ]
})
export class ModalEntradaComponent{

  // Creacion de los Formularios
  formEntrada: FormGroup;

  // Aqui se obtienen los valores formulario de netrada de productos
  proveedor: string;
  producto: string;
  cantidadCajas: number;
  nuestrasCajas: boolean;
  pesoCajas: number;
  pesoTarima: number;
  pesoBascula: number;
  pago: number;
  CoKg: boolean;
  destarado: number;
  pesoPorCaja: number;

  //Array
  public arrayProducto: any [] = [];


  constructor(private fb: FormBuilder) {
    this.crearFormulario();
    this.crearProductoProveedor();
    this.escucharNumeroCajas();
    this.escucharPesoCajas();
    this.escucharPesoTarima();
    this.escucharPesoBascula();
  }

  reiniciarFormEntrada(){
    this.formEntrada.reset({
      proveedor     : [],
      producto      : [],
      cajas         : [],
      nuestrasCajas : [true],
      pesoCaja      : [],
      pesoTarima    : [],
      pesoBascula   : [],
      pago          : [],
      CoKg          : [true],
      destarado     : [],
    }, {emitEvent: false});
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      proveedor     : [],
      producto      : [],
      cajas         : [],
      nuestrasCajas : [true],
      pesoCaja      : [],
      pesoTarima    : [],
      pesoBascula   : [],
      pago          : [],
      CoKg          : [true],
      destarado     : [],
    });
  }

  asignarValores(){
    this.proveedor = this.formEntrada.get('proveedor').value;
    this.producto = this.formEntrada.get('producto').value;
    this.cantidadCajas = this.formEntrada.get('cajas').value;
    this.nuestrasCajas = this.formEntrada.get('nuestrasCajas').value;
    this.pesoCajas = this.formEntrada.get('pesoCaja').value;
    this.pesoTarima = this.formEntrada.get('pesoTarima').value;
    this.pesoBascula = this.formEntrada.get('pesoBascula').value;
    this.pago = this.formEntrada.get('pago').value;
    this.CoKg = this.formEntrada.get('CoKg').value;
  }

  // Calculos Dinamicos
  escucharNumeroCajas() {
    this.formEntrada.get('cajas').valueChanges.subscribe( cantidadCajas => {
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado = ((cantidadCajas * this.pesoCajas) + this.pesoTarima) - this.pesoBascula;
      this.pesoPorCaja = this.destarado / cantidadCajas;
      this.formEntrada.patchValue({
        destarado: this.destarado
      });
    });
  }

  escucharPesoCajas() {
    this.formEntrada.get('pesoCaja').valueChanges.subscribe( pesoCajas => {
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado = ((this.cantidadCajas * pesoCajas) + this.pesoTarima) - this.pesoBascula;
      this.pesoPorCaja = this.destarado / this.cantidadCajas;
      this.formEntrada.patchValue({
        destarado: this.destarado
      });
    });
  }

  escucharPesoTarima() {
    this.formEntrada.get('pesoTarima').valueChanges.subscribe( pesoTarima => {
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado = ((this.cantidadCajas * this.pesoCajas) + pesoTarima) - this.pesoBascula;
      this.pesoPorCaja = this.destarado / this.cantidadCajas;
      this.formEntrada.patchValue({
        destarado: this.destarado
      });
    });
  }

  escucharPesoBascula() {
    this.formEntrada.get('pesoBascula').valueChanges.subscribe( pesoBascula => {
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;

      this.destarado = pesoBascula - ((this.cantidadCajas * this.pesoCajas) + this.pesoTarima);
      this.pesoPorCaja = this.destarado / this.cantidadCajas;
      this.formEntrada.patchValue({
        destarado: this.destarado
      });
    });
  }

  agregarTarima(){

  }

  crearProductoProveedor(){

  }

  // Cambios en la base de datos
  altaEntrada(){
    
  }

  agregarProducto(){
    this.asignarValores();
    this.arrayProducto.push([
      this.proveedor,
      this.producto,
      this.cantidadCajas,
      this.nuestrasCajas
    ]);
  }

}
