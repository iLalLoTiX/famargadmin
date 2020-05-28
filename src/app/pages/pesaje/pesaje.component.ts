import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

//servicios
import { CajasService } from '../../services/cajas.service';
import { FrutasServices } from '../../services/frutas.service';

//plugins
import swal from 'sweetalert';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-pesaje',
  templateUrl: './pesaje.component.html',
  styleUrls: ['./pesaje.component.css']
})
export class PesajeComponent implements OnInit {

  forma: FormGroup;
  formaDos: FormGroup;
  arreglo: FormGroup;
  public pedido;
  B = 0;
  A = 0;
  totalFacturar = 0;
  totalTarimas = 0;
  totalCajas = 0;
  totalBascula = 0;
  totalDestarado = 0;
  Falta = 0;
  Sobra = 0;

  public llenarCajasSelect;
  public llenarProductosSelect;
  public obtenerCliente;
  public banderaCliente = 0;

  
  banderaProducto = 0;
  public obtenerProducto;

  constructor(private fb: FormBuilder,
              public cs_: CajasService,
              public fs_: FrutasServices,
              public clients_: ClientesService,
              private productosS_: FrutasServices) {

    this.crearFormulario();
    this.crearFormularioDos();
    this.crearArreglo();
    this.escucharTienda();
    this.escucharProductoId();
    this.escucharProductoNombre();
    this.escucharPedido();
    this.escucharKgEx();
    this.escucharTarimas();
    this.fs_.cargarProductos().subscribe(a => this.llenarProductosSelect = a);
    this.cs_.cargarCajas().subscribe(a => this.llenarCajasSelect = a);
  }

  ngOnInit(): void {
  }

  // Preparar PDF para impresion
 imprimir(){



  }

  // Realiza cambios en el inventario de cajas de acuerdo al tipo de caja ingresado por el usuario
  altaCajas(){
    swal({
      title: 'Estas seguro?',
      text: 'Esta accion modificara el inventario de cajas y reiniciará el formulario de pesaje',
      icon: 'warning',
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.tarimas.controls.forEach(tarima => {
          console.log(tarima.get('tipo').value, tarima.get('cajas').value);
          if (tarima.get('cajas').value == null || tarima.get('tipos').value == null)
          {
            swal('Ingresa cuantas cajas y que tipo', {
              icon: 'warning',
            });
          }
          else{

            console.log    (tarima.get('tipo').value, tarima.get('cajas').value);
            this.cs_.prueba(tarima.get('tipo').value, tarima.get('cajas').value);
            swal('Listo!', {
              icon: 'success',
            });
          }
        });
      } else {
        swal('No han habido cambios...');
      }
    });

  }

  reiniciarForm(pedido: number, merma: number, kilosEx: number, total: number){

    this.forma.reset({
      pedido,
      kilosEx,
      merma,
      total
      }, {emitEvent: false}
    );
  }

  get tarimas()
  {
    return this.arreglo.get('tarimas') as FormArray;
  }

  crearFormularioDos(){
    this.formaDos = this.fb.group({
      tienda  : [],
      producto: [],
      productoNombre: [],
    });
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
    this.escucharTarimas();
  }

  borrarTarima(i){
    this.tarimas.removeAt(i);
  }

  // Escuchas cambios
// Calculos Dinamicos para destarar
escucharProductoId(){

  this.formaDos.get('producto').valueChanges.subscribe(producto =>
  {
    this.productosS_.buscarProductoId(producto).subscribe( (a: any) => {
      this.banderaProducto = a.length;
      if (a.length !== 0){
        this.obtenerProducto = a;
        this.formaDos.patchValue({
          productoNombre: this.obtenerProducto[0]['producto']
        }, {emitEvent: false});
      }
    });
  });
}

escucharProductoNombre(){

  this.formaDos.get('productoNombre').valueChanges.subscribe(producto =>
  {
    this.productosS_.buscarProductoNombre(producto).subscribe( (a: any) => {
      this.banderaProducto = a.length;
      if (a.length !== 0){
        this.obtenerProducto = a;
        this.formaDos.patchValue({
          producto: this.obtenerProducto[0]['id']
        }, {emitEvent: false});
      }
    });
  });
}
  escucharTienda(){

    this.formaDos.get('tienda').valueChanges.subscribe(tienda =>
    {
      this.clients_.buscarCliente(tienda).subscribe( (a: any) => {
        console.log(a.length);
        this.banderaCliente = a.length;
        if (a.length !== 0){
          this.obtenerCliente = a;
        }
      });
    });
  }

  escucharPedido() {
    this.forma.get('pedido').valueChanges.subscribe( pedido => {
      let merma = this.forma.get('merma').value;
      let kilosEx = this.forma.get('kilosEx').value;
      let total;
      merma = pedido * 0.05;
      kilosEx = pedido / 100;
      total = kilosEx + pedido + merma;
      this.reiniciarForm(pedido, merma, kilosEx, total);
      this.operacionTarima();
    });
  }

  escucharKgEx(){
    this.forma.get('kilosEx').valueChanges.subscribe( kilosEx => {
      const pedido = this.forma.get('pedido').value;
      const merma = this.forma.get('merma').value;
      let total;
      total = kilosEx + pedido + merma;
      this.reiniciarForm(pedido, merma, kilosEx, total);
      this.operacionTarima();
    });
  }

  escucharTarimas(){
    this.tarimas.controls.forEach( tarima => tarima.valueChanges.subscribe(a => this.operacionTarima()));
  }

  // Fin de escuchar cambios

  operacionTarima(){
    this.Falta = 0;
    this.totalFacturar = 0;
    this.totalBascula = 0;
    this.totalTarimas = 0;
    this.totalCajas = 0;
    this.totalDestarado = 0;
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
      this.totalFacturar = this.totalDestarado - ((this.totalDestarado) * 0.05) - this.forma.get('kilosEx').value;
      this.totalFacturar.toFixed(2);
      this.Falta = this.totalFacturar - this.forma.get('pedido').value;
      this.Sobra = Math.abs(this.Falta);
      this.Sobra.toFixed(2);
    });
  }
}
