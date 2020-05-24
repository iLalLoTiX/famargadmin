import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

// Servicios
import { EntradasService } from '../../../services/entradas.service';
import { ProveedoresService } from '../../../services/proveedores.service';

// Modelos
import { EntradaProducto } from 'src/app/interfaces/entradaProducto.interface';
import { EntradaProveedor } from 'src/app/interfaces/entradaProveedor.interface';
import { proveedor } from '../../../interfaces/proveedores.interface';

@Component({
  selector: 'app-modal-entrada',
  templateUrl: './modal-entrada.component.html',
  styles: [
  ]
})
export class ModalEntradaComponent{

  // Objetos
  public enviarProveedor = new EntradaProveedor;

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
  pago: number;

  // Variables temporales Pesaje
  destarado: number;
  pesoPorCaja: number;
  totalEsperado: number;
  difDestTotlEsp: number;
  pagoTotal: number;
  idProducto: number;
  fecha: Date = new Date();

  // Variables temporales Proveedor

  proveedorIdSeleccionado: string;
  proveedorNombre: string;
  TotalProveedor: number;
  idGen: number;

  // Array
  public arrayProducto: any [] = [];
  public verificarProducto: any [] = [];
  public buscarProveedor;
  public mostrarProveedores;
  public unicos;


  constructor(private fb: FormBuilder,
              private es_: EntradasService,
              private ps_: ProveedoresService){

    
    this.crearFormulario();
    this.escucharNumeroCajas();
    this.escucharPesoCajas();
    this.escucharPesoTarima();
    this.escucharPesoBascula();
    this.escucharPesoEsperado();
    this.escucharPago();
    this.escucharCoKg();
    this.ps_.cargarProveeores().subscribe(a => { this.mostrarProveedores = a; });

  }

  reiniciarFormEntrada(){
    this.destarado = 0 ;
    this.pesoPorCaja = 0 ;
    this.totalEsperado = 0 ;
    this.difDestTotlEsp = 0 ;
    this.pagoTotal = 0 ;
    this.TotalProveedor = 0;
    this.formEntrada.reset({
      nuestrasCajas : false,
      CoKg          : false,
    }, {emitEvent: false});
  }

  crearFormulario(){
    this.formEntrada = this.fb.group({
      producto      : [],
      cajas         : [],
      pesoEsperado  : [],
      nuestrasCajas : [false],
      pesoCaja      : [],
      pesoTarima    : [],
      pesoBascula   : [],
      pago          : [],
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

  escucharPago() {
    this.formEntrada.get('pago').valueChanges.subscribe( pagoC => {
      this.calcularDifDestTotlEsp();
      this.calcularTotalPago();
    });
  }

  escucharCoKg(){
    this.formEntrada.get('CoKg').valueChanges.subscribe( CoKg => {
      if (!CoKg){
        this.pagoTotal = this.formEntrada.get('cajas').value * this.formEntrada.get('pago').value;
      }else{
        this.pagoTotal = this.destarado * this.formEntrada.get('pago').value;
      }
    });
  }

  calcularTotalPago(){
    if ( !this.formEntrada.get('CoKg').value ){
      this.pagoTotal = this.formEntrada.get('cajas').value * this.formEntrada.get('pago').value;
    }else{
      this.pagoTotal = this.destarado * this.formEntrada.get('pago').value;
    }
  }

  calcularDifDestTotlEsp(){
    this.difDestTotlEsp = 0;
    this.pesoEsperado = this.formEntrada.get('pesoEsperado').value;
    this.cantidadCajas = this.formEntrada.get('cajas').value;

    this.totalEsperado = (this.pesoEsperado * this.cantidadCajas);
    this.difDestTotlEsp = this.destarado - this.totalEsperado;
  }

  seleccionarProveedor(id: string, nombre: string){

    this.proveedorIdSeleccionado = id;
    this.proveedorNombre = nombre;

  }

  regresar(){

    this.proveedorIdSeleccionado = undefined;

  }

  // Cambios en la base de datos
  altaEntrada(){
    this.verificarProducto = [];

    this.unicos.forEach( a => {
      this.verificarProducto.push(a);
    });

    this.verificarProducto.forEach(a => {
      const b = this.verificarProducto.indexOf(a);
      this.verificarProducto.splice(b, 1, [a, 0, 0, 0]);
    });

    this.unicos = [];

    this.arrayProducto.forEach(a => {
      this.verificarProducto.forEach(b => {
        if (a[0] === b[0])
        {
          b.splice(1 , 1, a[1] + b[1]);
          b.splice(2 , 1, a[2] + b[2]);
          b.splice(3 , 1, a[10] + b[3]);
        }
        else{
          console.log('no es:' + a[0] + '=' + b);
        }
      });
    });

    this.arrayProducto = [];


    this.enviarProveedor.fecha = this.fecha.getTime();
    this.enviarProveedor.nombreProveedor = this.proveedorNombre;
    this.enviarProveedor.idNombreProveedor = this.proveedorIdSeleccionado;
    this.enviarProveedor.total = this.TotalProveedor;

    this.es_.agregarEntradaProveedor(this.enviarProveedor, this.verificarProducto);
    this.verificarProducto = [];
    this.reiniciarFormEntrada();

  }


  agregarProducto(){


    this.arrayProducto.push([
      this.formEntrada.get('producto').value,
      this.destarado,
      this.formEntrada.get('cajas').value,
      this.formEntrada.get('pesoEsperado').value,
      this.formEntrada.get('nuestrasCajas').value,
      this.formEntrada.get('pesoCaja').value,
      this.formEntrada.get('pesoTarima').value,
      this.formEntrada.get('pesoBascula').value,
      this.formEntrada.get('pago').value,
      this.formEntrada.get('CoKg').value,
      this.pagoTotal
    ]);

    this.verificarProducto.push(
      this.formEntrada.get('producto').value
    );


    this.unicos = new Set(this.verificarProducto);
    this.reiniciarFormEntrada();
    this.sumarProductosProveedor();

  }

  sumarProductosProveedor(){
    this.TotalProveedor = 0;
    this.arrayProducto.forEach( a => {
    this.TotalProveedor = this.TotalProveedor + a[10];
    });
  }

  borrarProducto(i: number){
    this.arrayProducto.splice(i , 1);
    this.sumarProductosProveedor();
  }

  editarProducto(i: number){
    this.idProducto = i;
    this.formEntrada.setValue({
      producto      : this.arrayProducto[i][0],
      cajas         : this.arrayProducto[i][2],
      pesoEsperado  : this.arrayProducto[i][3],
      nuestrasCajas : this.arrayProducto[i][4],
      pesoCaja      : this.arrayProducto[i][5],
      pesoTarima    : this.arrayProducto[i][6],
      pesoBascula   : this.arrayProducto[i][7],
      pago          : this.arrayProducto[i][8],
      CoKg          : this.arrayProducto[i][9]
    }, {emitEvent: false});
  }

  actualizarProducto(){
    this.arrayProducto[this.idProducto][0] = this.formEntrada.get('producto').value;
    this.arrayProducto[this.idProducto][1] = this.destarado;
    this.arrayProducto[this.idProducto][2] = this.formEntrada.get('cajas').value;
    this.arrayProducto[this.idProducto][3] = this.formEntrada.get('pesoEsperado').value;
    this.arrayProducto[this.idProducto][4] = this.formEntrada.get('nuestrasCajas').value;
    this.arrayProducto[this.idProducto][5] = this.formEntrada.get('pesoCaja').value;
    this.arrayProducto[this.idProducto][6] = this.formEntrada.get('pesoTarima').value;
    this.arrayProducto[this.idProducto][7] = this.formEntrada.get('pesoBascula').value;
    this.arrayProducto[this.idProducto][8] = this.formEntrada.get('pago').value;
    this.arrayProducto[this.idProducto][9] = this.formEntrada.get('CoKg').value;
    this.arrayProducto[this.idProducto][10] = this.pagoTotal;

    this.reiniciarFormEntrada();
    this.sumarProductosProveedor();
    this.idProducto = undefined;
  }

}
