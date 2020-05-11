import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

//servicios
import { CajasService } from 'src/app/services/cajas.service';
import { FrutasServices } from 'src/app/services/frutas.service';

//plugins
import { PdfMakeWrapper, Table} from 'pdfmake-wrapper';
import swal from 'sweetalert';
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
  Sobra: number = 0;

  public llenarCajasSelect;
  public llenarProductosSelect;

  constructor(private fb: FormBuilder, public cs_: CajasService, public fs_: FrutasServices) {

    this.crearFormulario();
    this.crearArreglo();
    this.escucharPedido();
    this.escucharKgEx();
    this.escucharTarimas();
    this.fs_.cargarTabla().subscribe(a => this.llenarProductosSelect = a);
    this.cs_.cargarCajas().subscribe(a => this.llenarCajasSelect = a);
  }

  ngOnInit(): void {
  }

  imprimir(){
    if(this.producto === undefined || this.tienda === undefined ){
      swal("Falta especificar la tienda o el producto", {
        icon: "warning",
      });
    }else{
      PdfMakeWrapper.setFonts(pdfFonts);
      const pdf = new PdfMakeWrapper();
      pdf.add('Tienda: ' + this.tienda + '      Producto: ' + this.producto);

      let C = new Table([
        [ 'Tarima', 'Cajas','Bascula','Destarado']
      ]).widths([ 100 , 100 , 100 , 100 ]).end;
      pdf.add(C);
      this.tarimas.controls.forEach(tarima => {
        C = new Table([
          [ tarima.get('tarima').value, tarima.get('cajas').value, tarima.get('bascula').value, tarima.get('destarado').value]
        ]).widths([ 100 , 100 , 100 , 100 ]).end;
        pdf.add( C);
      });

      C = new Table([
        [ this.totalTarimas, this.totalCajas ,this.totalBascula, this.totalDestarado]
      ]).widths([ 100 , 100 , 100 , 100 ]).background('#7cd5ff').end;
      pdf.add( C);
      pdf.add('Total a facturar: ' + this.totalFacturar);
      pdf.create().open();
    }
  }

  altaCajas(){
    swal({
      title: "Estas seguro?",
      text: "Esta accion modificara el inventario de cajas y reiniciará el formulario de pesaje",
      icon: "warning",
      buttons: ['Cancelar', true],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.tarimas.controls.forEach(tarima => {
          if(tarima.get('cajas').value == null || tarima.get('tipos').value == null)
          {
            swal("Ingresa cuantas cajas y que tipo", {
              icon: "warning",
            });
          }
          else{
            this.cs_.prueba(tarima.get('tipo').value, tarima.get('cajas').value);
            swal("Listo!", {
              icon: "success",
            });
          }
        });
      } else {
        swal("No han habido cambios...");
      }
    });
    
  }

  reiniciarForm(pedido: number, merma: number, kilosEx: number, total: number){

    this.forma.reset({
      pedido,
      kilosEx,
      merma,
      total
      },{emitEvent: false}
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
    this.escucharTarimas();
  }

  borrarTarima(i){
    this.tarimas.removeAt(i);
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
      let pedido = this.forma.get('pedido').value;
      let merma = this.forma.get('merma').value;
      let total;
      total = kilosEx + pedido + merma;
      this.reiniciarForm(pedido, merma, kilosEx, total);
      this.operacionTarima();
    });
  }

  escucharTarimas(){
    this.tarimas.controls.forEach( tarima => tarima.valueChanges.subscribe(a => this.operacionTarima()));
  }

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
