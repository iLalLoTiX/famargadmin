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




@NgModule({
    declarations:[
        DashboardComponent,
        ProveedoresComponent,
        ProductosComponent,
        PagesComponent,
        PesajeComponent,
        CajasComponent,
        EntradasComponent,
        ModalEntradaComponent,
        ModalproductosComponent
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
        PagesRoutingModule
    ]
})
export class PagesModule{ }