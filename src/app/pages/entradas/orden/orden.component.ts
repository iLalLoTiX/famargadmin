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

// Router
import { Router } from '@angular/router';

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
  
  public prueba = new Array();

  public banderaProducto;

  public orden: Orden = new Orden();

  public total: number;

  public idGen: number;

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
    public ProductosServices: FrutasServices,
    public router: Router) {

      this.OrdenesServices.generarId().subscribe(a => { this.idGen = a.data()['id'] + 1; } );

      if (localStorage.getItem('proveedor') !== null){
        this.proveedor = JSON.parse(localStorage.getItem('proveedor'));
      }

      if (localStorage.getItem('numProd') === null)
      {

        console.log(JSON.parse(localStorage.getItem('numProd')));
        this.productos = new Array(this.producto);

      }else{
        let a = JSON.parse(localStorage.getItem('numProd'));

        for(let i = 0; i < a; i++){
          let guardado = localStorage.getItem( 'prodOrd_' + i);
          this.productos.push(JSON.parse(guardado));
          console.log(this.productos);
        }
      }
  }

  ngOnInit(): void {

  }

  modalProveedores(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  recibirProveedor(proveedor_: proveedor){
    this.proveedor = proveedor_;
    localStorage.setItem('proveedor',  JSON.stringify(proveedor_));
  }

  // Escuchar cambios
  idProducto(i: number, $event){
    this.guardarLocalStorage(i);
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
    this.guardarLocalStorage(i);
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
    this.guardarLocalStorage(i);
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
    this.guardarLocalStorage(i);
    this.productos[i].total = this.productos[i].cantidad * $event;
    this.sumarPrecioProductos();
  }

  medida(i, $event){
    this.guardarLocalStorage(i);
    this.productos[i].medida = $event;
    this.productos[i].total = this.productos[i].cantidad * this.productos[i].precio;
    this.sumarPrecioProductos();
  }
  // END Escuchar cambios

  borrarProducto(i: number){

    // Borrar localstorage de productos temporalmente
    for(let i = 0; i < this.productos.length; i++){
      localStorage.removeItem( 'prodOrd_' + i);
    }

    // Borrar del Array el prpducto seleccionado
    this.productos.splice(i , 1);

    // Reestructurar localstorage de producos
    for (let i = 0; i < this.productos.length; i++)
    {
      localStorage.setItem(
      'prodOrd_' + i ,
        JSON.stringify(this.productos[i])
      );
    }

    // Reconteo de productos
    localStorage.setItem('numProd',  this.productos.length.toString());
  }

  sumarPrecioProductos(){
    this.total = 0;
    this.productos.forEach( a => {
      this.total = a.total + this.total;
    });
  }

  agregarProducto(){
    if ((Object.keys(this.productos[this.productos.length - 1]).length === 0) || (Number.isNaN(this.total)  === true)){
      swal({
        text: 'Completa los campos de la fila ' + this.productos.length + ' antes de agregar otro producto',
        icon: 'info',
      });
      return;
    }

    if ((this.productos[this.productos.length - 1].productoNombre === undefined)){
      swal({
        text: 'Ingresa el ID del producto',
        icon: 'info',
      });
      return;
    }
    if (this.productos[this.productos.length - 1].idProducto === undefined){
      swal({
        text: 'Ingresa el Nombre del producto',
        icon: 'info',
      });
      return;
    }
    let prod = new EntradaProducto();
    this.productos.push(prod);
  }

  crearOrden(){
    this.orden.idProveedor = this.proveedor.id;
    this.orden.nombreProveedor = this.proveedor.nombreProveedor;
    this.orden.estado = false;
    this.orden.fecha = new Date().getTime();
    this.orden.total = this.total;

    if ( this.orden.idProveedor === undefined || this.orden.idProveedor === undefined){
      swal({
        title:  'Atencion!',
        text:   'No haz seleccionado un proveedor',
        icon:   'warning',
        buttons: ['Cancelar', true]
      });
      return;
    }

    if ((Object.keys(this.productos[this.productos.length - 1]).length === 0) || (Number.isNaN(this.total)  === true)){
      swal({
        text: 'Completa los campos de la fila ' + this.productos.length + ' antes de agregar otro producto',
        icon: 'info',
      });
      return;
    }

    if ((this.productos[this.productos.length - 1].productoNombre === undefined)){
      swal({
        text: 'Ingresa el ID del producto',
        icon: 'info',
      });
      return;
    }
    if (this.productos[this.productos.length - 1].idProducto === undefined){
      swal({
        text: 'Ingresa el Nombre del producto',
        icon: 'info',
      });
      return;
    }

    swal({
      title: 'Atencion!',
      text: 'Quieres quieres crear la orden de compra: ' + this.idGen + '?',
      icon: 'info',
      closeOnClickOutside: false,
      buttons: ['Cancelar', true]
    })
    .then((willDelete) => {
      if (willDelete) {

        this.OrdenesServices.agregarOrden(this.orden, this.productos, this.idGen);
        this.reiniciarLocalStorage();
        swal('Listo!', {
          text: 'Se ha creado la orden de compra: ' + this.idGen + '?',
          closeOnClickOutside: false,
          icon: 'success'

        }).then((willDelete) =>{ 
          if (willDelete){
            swal({
              text: 'Quieres crear otra orden de compra? Se abrirá una nueva ventana',
              icon: 'info',
              closeOnClickOutside: false,
              buttons: ['Cancelar', true]
            })
            .then((willDelete) => {
              if (willDelete) {
                const url = this.router.createUrlTree(['/orden']);
                window.open(`#/${url}/nuevo`, '_blank');
                window.close();
              } else {
                window.close();
              }
            });
          }
        });
      } else {
        swal('No han habido cambios...');
      }
    });
  }
  
  reiniciarLocalStorage(){
    let a = JSON.parse(localStorage.getItem('numProd'));

    for(let i = 0; i < a; i++){
      localStorage.removeItem( 'prodOrd_' + i);
    }
    localStorage.removeItem('numProd');
    localStorage.removeItem('proveedor');
    let prod = new EntradaProducto();
    this.productos = new Array(prod);
    this.proveedor = new proveedor();
  }

  guardarLocalStorage(i: number){
  // Guardo el objeto como un string
    localStorage.setItem(
      'prodOrd_' + i ,
        JSON.stringify(this.productos[i])
      );
      
    localStorage.setItem('numProd',  this.productos.length.toString());
  }

}
