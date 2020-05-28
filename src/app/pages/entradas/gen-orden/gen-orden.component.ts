import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
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

  @Output() regresarProveedor: EventEmitter<any>  = new EventEmitter();
  @Input () proveedorIdR: string;
  @Input () proveedorNombreR: string;

  // Formularios
  public formOrden: FormGroup;

  // Variables Temporales
  public banderaProducto = 0;
  public obtenerProducto;
  public iProducto: number;

  // Arreglos
  public arrayProducto: any [] = [];

  public enviarOrden: Orden = new Orden();

  constructor(private fb: FormBuilder,
              public ProductosServices: FrutasServices,
              public OrdenServices: OrdenesService){
    this.crearFormularioOrden();
    this.escucharProductoId();
    this.escucharProductoNombre();
  }

  regresar(){
    this.proveedorIdR = null;
    this.proveedorNombreR = null;
    this.regresarProveedor.emit({id: this.proveedorIdR, nombre: this.proveedorNombreR});
  }

  crearFormularioOrden(){
    this.formOrden = this.fb.group({
      producto       : [],
      productoNombre : [],
      kg             : [],
      precio         : []
    });
  }

  agregarProducto(){
    this.arrayProducto.push([
      this.formOrden.get('producto').value,
      this.formOrden.get('productoNombre').value,
      this.formOrden.get('kg').value,
      this.formOrden.get('precio').value,
    ]);
    this.reiniciarForm();
  }

  reiniciarForm(){
    this.formOrden.reset();
  }

  editarProducto(i: number){
    this.iProducto = i;
    this.formOrden.setValue({
      producto       : this.arrayProducto[i][0],
      productoNombre : this.arrayProducto[i][1],
      kg             : this.arrayProducto[i][2],
      precio         : this.arrayProducto[i][3],
    }, {emitEvent: false});
  }

  actualizarProducto(){
    this.arrayProducto[this.iProducto][0] = this.formOrden.get('producto').value;
    this.arrayProducto[this.iProducto][1] = this.formOrden.get('productoNombre').value;
    this.arrayProducto[this.iProducto][2] = this.formOrden.get('kg').value;
    this.arrayProducto[this.iProducto][3] = this.formOrden.get('precio').value;
    this.iProducto = undefined;
    this.reiniciarForm();
  }

  borrarProducto(i: number){
    this.arrayProducto.splice(i , 1);
  }

  escucharProductoId(){

    this.formOrden.get('producto').valueChanges.subscribe(producto =>
    {
      this.ProductosServices.buscarProductoId(producto).subscribe( (a: any) => {
        this.banderaProducto = a.length;
        if (a.length !== 0){
          this.obtenerProducto = a;
          this.formOrden.patchValue({
            productoNombre: this.obtenerProducto[0]['producto']
          }, {emitEvent: false});
        }
      });
    });
  }

  escucharProductoNombre(){

    this.formOrden.get('productoNombre').valueChanges.subscribe(producto =>
    {
      this.ProductosServices.buscarProductoNombre(producto).subscribe( (a: any) => {
        this.banderaProducto = a.length;
        if (a.length !== 0){
          this.obtenerProducto = a;
          this.formOrden.patchValue({
            producto: this.obtenerProducto[0]['id']
          }, {emitEvent: false});
        }
      });
    });
  }

  altaOrden(){
    const fecha = new Date();
    console.log(fecha.getTime());
    this.enviarOrden.id = this.proveedorIdR;
    this.enviarOrden.nombreProveedor = this.proveedorNombreR;
    this.enviarOrden.fecha = fecha.getTime();

    this.OrdenServices.agregarOrden(this.enviarOrden, this.arrayProducto);
  }

}
