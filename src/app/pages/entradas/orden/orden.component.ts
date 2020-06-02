import { Component, OnInit, TemplateRef } from '@angular/core';

// Ngx Bootstrap
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

// Servicios
import { OrdenesService } from '../../../services/ordenes.service';
import { FrutasServices } from '../../../services/frutas.service';

// Interfaces
import { proveedor } from '../../../interfaces/proveedores.interface';
import { EntradaProducto } from 'src/app/interfaces/entradaProducto.interface';
import { Orden } from 'src/app/interfaces/orden.interface';

// SweetAlter2
import swal from 'sweetalert';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styles: [
  ]
})
export class OrdenComponent implements OnInit {

  public modalRef: BsModalRef;

  public proveedor: proveedor = new proveedor();

  public producto: EntradaProducto = new EntradaProducto();

  public productos = new Array();

  public banderaProducto;

  public orden: Orden = new Orden();

  public total: number;

  medidas = [{
    id: 'cajas'
   },
   {
    id: 'kilos'
   },
   {
    id: 'pieza'
   }];

  constructor(
    public  OrdenesServices: OrdenesService,
    private modalService: BsModalService,
    public ProductosServices: FrutasServices) {

      this.productos = new Array(this.producto);


  }

  ngOnInit(): void {

  }

  modalProveedores(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  recibirProveedor(proveedor_: proveedor){
    this.proveedor = proveedor_;
  }

  agregarProducto(){
    let prod = new EntradaProducto();
    this.productos.push(prod);
  }

  // Escuchar cambios
  idProducto(i: number, $event){
    this.ProductosServices.buscarProductoId($event).subscribe( (a: any) => {
      if (a.length !== 0){
        if (this.productos[i].medida === 'cajas'    || this.productos[i].medida === undefined){
          this.productos[i].productoNombre = a[0]['producto'];
          this.productos[i].pesoEsperado = a[0]['pesoEsperado'];
          this.productos[i].pesoTotal = this.productos[i].cantidad * a[0]['pesoEsperado'];
          this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
          this.sumarPrecioProductos();
        }else{
          this.productos[i].productoNombre = a[0]['producto'];
          this.productos[i].pesoTotal = this.productos[i].cantidad;
          this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
          this.sumarPrecioProductos();
        }
      }
    });

  }

  productoNombre(i, $event){
    this.ProductosServices.buscarProductoNombre($event).subscribe( (a: any) => {
      console.log(this.productos[i].cantidad);
      if (a.length !== 0){
        if (this.productos[i].medida === 'cajas' || this.productos[i].medida === undefined){
          this.productos[i].idProducto = a[0]['id'];
          this.productos[i].pesoEsperado = a[0]['pesoEsperado'];
          this.productos[i].pesoTotal = this.productos[i].cantidad * a[0]['pesoEsperado'];
          this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
          this.sumarPrecioProductos();
        }
        else{
          this.productos[i].idProducto = a[0]['id'];
          this.productos[i].pesoTotal = this.productos[i].cantidad;
          this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
          this.sumarPrecioProductos();
        }
      }
    });
  }

  cantidad(i, $event){
    if (this.productos[i].medida === 'cajas' || this.productos[i].medida === undefined){
      this.productos[i].pesoTotal = $event * this.productos[i].pesoEsperado;
      this.productos[i].total = $event * this.productos[i].precio;
      this.sumarPrecioProductos();
    }else{
      this.productos[i].pesoTotal = $event;
      this.productos[i].total = $event * this.productos[i].precio;
      this.sumarPrecioProductos();
    }
  }

  precio(i, $event){
    this.productos[i].total = this.productos[i].cantidad * $event;
    this.sumarPrecioProductos();
  }

  medida(i, $event){
    this.productos[i].medida = $event;
    this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
    this.sumarPrecioProductos();
  }

  borrarProducto(i: number){
    this.productos.splice(i , 1);
  }

  sumarPrecioProductos(){
    this.total = 0;
    this.productos.forEach( a => {
      this.total = a.total + this.total;
    });
  }

  crearOrden(){
    this.orden.idProveedor = this.proveedor.id;
    this.orden.nombreProveedor = this.proveedor.nombreProveedor;
    this.orden.estado = false;
    this.orden.fecha = new Date().getTime();
    this.orden.total = this.total;
    this.OrdenesServices.agregarOrden(this.orden, this.productos);
  }
}
