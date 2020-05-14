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
  pesoCajas: number;
  pesoEsperado: number;
  pesoTarima: number;
  pesoBascula: number;
  pagoC: number;
  pagoKg: number;

  // Variables
  destarado: number;
  pesoPorCaja: number;
  totalEsperado: number;
  difDestTotlEsp: number;
  pagoTotalKg: number;
  pagoTotalC: number;
  idProducto: number;

  // Array
  public arrayProducto: any [] = [];


  constructor(private fb: FormBuilder) {
    this.crearFormulario();
    this.crearProductoProveedor();
    this.escucharNumeroCajas();
    this.escucharPesoCajas();
    this.escucharPesoTarima();
    this.escucharPesoBascula();
    this.escucharPesoEsperado();
    this.escucharPagoC();
    this.escucharPagoKg();
    console.log(this.idProducto);
  }

  reiniciarFormEntrada(){
    this.destarado = 0 ;
    this.pesoPorCaja = 0 ;
    this.totalEsperado = 0 ;
    this.difDestTotlEsp = 0 ;
    this.pagoTotalKg = 0 ;
    this.pagoTotalC = 0 ;
    this.formEntrada.reset({
      proveedor     : '',
      producto      : '',
      cajas         : 0,
      pesoEsperado  : 0,
      nuestrasCajas : false,
      pesoCaja      : 0,
      pesoTarima    : 0,
      pesoBascula   : 0,
      pagoC         : 0,
      pagoKg        : 0,
      CoKg          : false
    }, {emitEvent: false});
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      proveedor     : [],
      producto      : [],
      cajas         : [],
      pesoEsperado  : [],
      nuestrasCajas : [false],
      pesoCaja      : [],
      pesoTarima    : [],
      pesoBascula   : [],
      pagoC         : [],
      pagoKg        : [],
      CoKg          : [false],
    });
  }

  // Calculos Dinamicos para destarar
  escucharNumeroCajas() {
    this.formEntrada.get('cajas').valueChanges.subscribe( cantidadCajas => {
      this.destarado = 0;
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado =  this.pesoBascula - ((cantidadCajas * this.pesoCajas) + this.pesoTarima);
      this.pesoPorCaja = this.destarado / cantidadCajas;

      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharPesoCajas() {
    this.formEntrada.get('pesoCaja').valueChanges.subscribe( pesoCajas => {
      this.destarado = 0;
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado = this.pesoBascula - ((this.cantidadCajas * pesoCajas) + this.pesoTarima);
      this.pesoPorCaja = this.destarado / this.cantidadCajas;

      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharPesoTarima() {
    this.formEntrada.get('pesoTarima').valueChanges.subscribe( pesoTarima => {
      this.destarado = 0;
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoBascula = this.formEntrada.get('pesoBascula').value;

      this.destarado = this.pesoBascula - ((this.cantidadCajas * this.pesoCajas) + pesoTarima);
      this.pesoPorCaja = this.destarado / this.cantidadCajas;

      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharPesoBascula() {
    this.formEntrada.get('pesoBascula').valueChanges.subscribe( pesoBascula => {
      this.destarado = 0;
      this.cantidadCajas = this.formEntrada.get('cajas').value;
      this.pesoCajas = this.formEntrada.get('pesoCaja').value;
      this.pesoTarima = this.formEntrada.get('pesoTarima').value;

      this.destarado = pesoBascula - ((this.cantidadCajas * this.pesoCajas) + this.pesoTarima);
      this.pesoPorCaja = this.destarado / this.cantidadCajas;

      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  // Calculos dinamicos para perdida o ganancia en relacion al peso esperado por caja

  escucharPesoEsperado() {
    this.formEntrada.get('pesoEsperado').valueChanges.subscribe( pesoEsperado => {

      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharPagoC() {
    this.formEntrada.get('pagoC').valueChanges.subscribe( pagoC => {
      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharPagoKg() {
    this.formEntrada.get('pagoKg').valueChanges.subscribe( pagoC => {
      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  calcularTotalPago(){
    this.pagoTotalC = this.formEntrada.get('cajas').value * this.formEntrada.get('pagoC').value;
    this.pagoTotalKg = this.destarado * this.formEntrada.get('pagoKg').value;
  }

  calcularDifDestTotlEsp(){
    this.difDestTotlEsp = 0;
    this.pesoEsperado = this.formEntrada.get('pesoEsperado').value;
    this.cantidadCajas = this.formEntrada.get('cajas').value;

    this.totalEsperado = (this.pesoEsperado * this.cantidadCajas);
    this.difDestTotlEsp = this.destarado - this.totalEsperado;
  }

  agregarTarima(){

  }

  crearProductoProveedor(){

  }

  // Cambios en la base de datos
  altaEntrada(){
console.log(this.destarado);
  }

  agregarProducto(){
    this.arrayProducto.push([
      this.formEntrada.get('proveedor').value,
      this.formEntrada.get('producto').value,
      this.destarado,
      this.formEntrada.get('cajas').value,
      this.formEntrada.get('pesoEsperado').value,
      this.formEntrada.get('nuestrasCajas').value,
      this.formEntrada.get('pesoCaja').value,
      this.formEntrada.get('pesoTarima').value,
      this.formEntrada.get('pesoBascula').value,
      this.formEntrada.get('pagoC').value,
      this.formEntrada.get('pagoKg').value,
      this.formEntrada.get('CoKg').value,
    ]);
    this.reiniciarFormEntrada();
  }

  borrarProducto(i: number){
    this.arrayProducto.splice(i , 1);
  }

  editarProducto(i: number){
    this.idProducto = i;
    this.formEntrada.setValue({
      proveedor     : this.arrayProducto[i][0],
      producto      : this.arrayProducto[i][1],
      cajas         : this.arrayProducto[i][3],
      pesoEsperado  : this.arrayProducto[i][4],
      nuestrasCajas : this.arrayProducto[i][5],
      pesoCaja      : this.arrayProducto[i][6],
      pesoTarima    : this.arrayProducto[i][7],
      pesoBascula   : this.arrayProducto[i][8],
      pagoC         : this.arrayProducto[i][9],
      pagoKg        : this.arrayProducto[i][10],
      CoKg          : this.arrayProducto[i][11]
    }, {emitEvent: false});
  }

  actualizarProducto(){
    this.arrayProducto[this.idProducto][0] = this.formEntrada.get('proveedor').value;
    this.arrayProducto[this.idProducto][1] = this.formEntrada.get('producto').value;
    this.arrayProducto[this.idProducto][2] = this.destarado;
    this.arrayProducto[this.idProducto][3] = this.formEntrada.get('cajas').value;
    this.arrayProducto[this.idProducto][4] = this.formEntrada.get('pesoEsperado').value;
    this.arrayProducto[this.idProducto][5] = this.formEntrada.get('nuestrasCajas').value;
    this.arrayProducto[this.idProducto][6] = this.formEntrada.get('pesoCaja').value;
    this.arrayProducto[this.idProducto][7] = this.formEntrada.get('pesoTarima').value;
    this.arrayProducto[this.idProducto][8] = this.formEntrada.get('pesoBascula').value;
    this.arrayProducto[this.idProducto][9] = this.formEntrada.get('pagoC').value;
    this.arrayProducto[this.idProducto][10] = this.formEntrada.get('pagoKg').value;
    this.arrayProducto[this.idProducto][11] = this.formEntrada.get('CoKg').value;

    this.reiniciarFormEntrada();
    this.idProducto = undefined;
  }

}
