import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';

import { PagesRoutingModule } from './pages-routing.module';


@NgModule({
    declarations:[
        DashboardComponent,
        ProveedoresComponent,
        ProductosComponent,
        PagesComponent
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
        PagesRoutingModule
    ]
})
export class PagesModule{ }