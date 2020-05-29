import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
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
export class GenOrdenComponent implements OnInit {

// Variables temporales Proveedor

  @Output() regresarProveedor: EventEmitter<any>  = new EventEmitter();
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

  constructor(private fb: FormBuilder,
              public ProductosServices: FrutasServices,
              public OrdenServices: OrdenesService){
    this.crearFormularioOrden();
    this.escucharProductoId();
    this.escucharProductoNombre();
  }

  ngOnInit(){
    
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
    this.arrayProducto.push({
      idProducto: this.formOrden.get('producto').value,
      producto: this.formOrden.get('productoNombre').value,
      peso: this.formOrden.get('kg').value,
      precio: this.formOrden.get('precio').value,}
    );
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
    this.arrayProducto[this.iProducto].peso = this.formOrden.get('kg').value;
    this.arrayProducto[this.iProducto].precio = this.formOrden.get('precio').value;
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
