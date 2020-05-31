import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FrutasServices } from '../../../services/frutas.service';

// Interfaces
import { Orden } from '../../../interfaces/orden.interface';

// Servicios
import { OrdenesService } from '../../../services/ordenes.service';

@Component({
  selector: 'app-gen-orden',
  templateUrl: './gen-orden.component.html',
  styles: [
  ]
})
export class GenOrdenComponent {

// Variables temporales Proveedor

  @Output() obtenerProveedor: EventEmitter<any>  = new EventEmitter();
  @Input () proveedorIdR: string;
  @Input () proveedorNombreR: string;
  @Input () arrayProducto: any [] = [];
  @Input () enviarOrden: Orden = new Orden();

  // Formularios
  public formOrden: FormGroup;

  // Variables Temporales
  public banderaProducto = 0;
  public obtenerProducto;
  public iProducto: number;
  public total;

  constructor(private fb: FormBuilder,
              public ProductosServices: FrutasServices,
              public OrdenServices: OrdenesService){
    this.crearFormularioOrden();
    this.escucharCantidadCajas();
    this.escucharProductoId();
    this.escucharProductoNombre();
    this.escucharPrecio();
  }

  crearFormularioOrden(){
    this.formOrden = this.fb.group({
      cantidad        : [],
      producto        : [],
      productoNombre  : [],
      pesoEsperado    : [],
      peso            : [],
      precio          : [],
      medida          : [],
      total           : []
    });
  }

  agregarProducto(){
    this.arrayProducto.push({
      cantidad        : this.formOrden.get('cantidad').value,
      producto        : this.formOrden.get('producto').value,
      productoNombre  : this.formOrden.get('productoNombre').value,
      peso            : this.formOrden.get('peso').value,
      precio          : this.formOrden.get('precio').value,
      medida          : this.formOrden.get('medida').value,
      total           : this.formOrden.get('peso').value * this.formOrden.get('precio').value,
    });
    console.log(this.arrayProducto);
    this.reiniciarForm();
  }

  reiniciarForm(){
    this.formOrden.reset();
  }

  editarProducto(i: number){
    this.iProducto = i;
    this.formOrden.setValue({
      producto       : this.arrayProducto[i].idProducto,
      productoNombre : this.arrayProducto[i].producto,
      kg             : this.arrayProducto[i].peso,
      precio         : this.arrayProducto[i].precio,
    }, {emitEvent: false});
  }

  actualizarProducto(){
    this.arrayProducto[this.iProducto].idProducto = this.formOrden.get('producto').value;
    this.arrayProducto[this.iProducto].producto = this.formOrden.get('productoNombre').value;
    this.arrayProducto[this.iProducto].peso = this.formOrden.get('peso').value;
    this.arrayProducto[this.iProducto].precio = this.formOrden.get('precio').value;
    this.iProducto = undefined;
    this.reiniciarForm();
  }

  borrarProducto(i: number){
    this.arrayProducto.splice(i , 1);
  }

  escucharCantidadCajas(){

    this.formOrden.get('cantidad').valueChanges.subscribe(cantidad =>
    {
      if (this.formOrden.get('medida').value === 'caja'){
        this.formOrden.patchValue({
          peso  : cantidad * this.formOrden.get('pesoEsperado').value,
          total : cantidad * this.formOrden.get('precio').value
        }, {emitEvent: false});
      }else{
        this.formOrden.patchValue({
          total : this.formOrden.get('cantidad').value * this.formOrden.get('precio').value
        }, {emitEvent: false});
      }
    });
  }

  escucharProductoId(){

    this.formOrden.get('producto').valueChanges.subscribe(producto =>
    {
      this.ProductosServices.buscarProductoId(producto).subscribe( (a: any) => {
        if (a.length !== 0){
          if (this.formOrden.get('medida').value === 'caja'){
            console.log(this.formOrden.get('cantidad').value , this.formOrden.get('precio').value);
            this.formOrden.patchValue({
              productoNombre: a[0]['producto'],
              pesoEsperado  : a[0]['pesoEsperado'],
              peso          : this.formOrden.get('cantidad').value * a[0]['pesoEsperado'],
              total         : this.formOrden.get('cantidad').value * this.formOrden.get('precio').value
            }, {emitEvent: false});
          }else{
            console.log(this.formOrden.get('cantidad').value , this.formOrden.get('precio').value);
            this.formOrden.patchValue({
              productoNombre: a[0]['producto'],
              total         : this.formOrden.get('cantidad').value * this.formOrden.get('precio').value
            }, {emitEvent: false});
          }
        }
      });
    });
  }

  escucharProductoNombre(){

    this.formOrden.get('productoNombre').valueChanges.subscribe(producto =>
    {
      this.ProductosServices.buscarProductoNombre(producto).subscribe( (a: any) => {
        if (a.length !== 0){
          if (this.formOrden.get('medida').value === 'caja'){
            console.log(this.formOrden.get('cantidad').value , this.formOrden.get('precio').value);
            this.formOrden.patchValue({
              producto      : a[0]['id'],
              pesoEsperado  : a[0]['pesoEsperado'],
              kg            : this.formOrden.get('cantidad').value * a[0]['pesoEsperado'],
              total         : this.formOrden.get('cantidad').value * this.formOrden.get('precio').value
            }, {emitEvent: false});
          }else{
            console.log(this.formOrden.get('cantidad').value , this.formOrden.get('precio').value);
            this.formOrden.patchValue({
              producto      : a[0]['id'],
              total         : this.formOrden.get('cantidad').value * this.formOrden.get('precio').value
            }, {emitEvent: false});
          }
        }
      });
    });
  }

  escucharPrecio(){
    this.formOrden.get('precio').valueChanges.subscribe(precio =>
      {
        if (this.formOrden.get('medida').value === 'caja'){
          this.formOrden.patchValue({
            total         : this.formOrden.get('cantidad').value * precio
          }, {emitEvent: false});
        }else{
          this.formOrden.patchValue({
            total         : this.formOrden.get('cantidad').value * precio
          }, {emitEvent: false});
        }
      });
  }

  altaOrden(){
    console.log(this.proveedorIdR);
    console.log(this.proveedorNombreR);
    if (Object.keys(this.enviarOrden).length === 0){
      const fecha = new Date();
      this.enviarOrden.idProveedor = this.proveedorIdR;
      this.enviarOrden.nombreProveedor = this.proveedorNombreR;
      this.enviarOrden.fecha = fecha.getTime();
      this.enviarOrden.estado = false;
      this.OrdenServices.agregarOrden(this.enviarOrden, this.arrayProducto);
    }else{
      this.OrdenServices.agregarOrden(this.enviarOrden, this.arrayProducto);
    }
  }

  editarOrdenProducto(){
    console.log('uwu');
  }

}
