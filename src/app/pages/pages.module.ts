import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { EntradasComponent } from './entradas/entradas.component';
import { PesajeComponent } from './pesaje/pesaje.component';
import { CajasComponent } from './cajas/cajas.component';
import { ModalEntradaComponent } from './entradas/modal-entrada/modal-entrada.component';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ModalproductosComponent } from './productos/modalproductos/modalproductos.component';
import { ModalProveedoresComponent } from './proveedores/modal-proveedores/modal-proveedores.component';
import { PrintComponent } from './print/print.component';
import { DetalleEntradaComponent } from './entradas/detalle-entrada/detalle-entrada.component';

// Tabs NGX
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ModalCajasComponent } from './cajas/modal-cajas/modal-cajas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ModalClientesComponent } from './clientes/modal-clientes/modal-clientes.component';
import { SelectProveedorComponent } from './entradas/select-proveedor/select-proveedor.component';
import { RecibirProdProvComponent } from './entradas/detalle-entrada/recibir-prod-prov/recibir-prod-prov.component';
import { OrdenComponent } from './entradas/orden/orden.component';


@NgModule({
    declarations: [
        DashboardComponent,
        ProveedoresComponent,
        ProductosComponent,
        PagesComponent,
        PesajeComponent,
        CajasComponent,
        EntradasComponent,
        ModalEntradaComponent,
        ModalproductosComponent,
        ModalProveedoresComponent,
        PrintComponent,
        DetalleEntradaComponent,
        ModalCajasComponent,
        ClientesComponent,
        ModalClientesComponent,
        SelectProveedorComponent,
        RecibirProdProvComponent,
        OrdenComponent
    ],
    exports: [
        DashboardComponent,
        ProveedoresComponent,
        ProductosComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        SharedModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        PagesRoutingModule
    ]
})
export class PagesModule{ }
