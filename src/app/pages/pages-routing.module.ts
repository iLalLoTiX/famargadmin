import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ProductosComponent } from './productos/productos.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PesajeComponent } from './pesaje/pesaje.component';
import { CajasComponent } from './cajas/cajas.component';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent ,
    children: [
      {  path: 'productos', component: ProductosComponent },
      {  path: 'cajas', component: CajasComponent },
      {  path: 'pesaje', component: PesajeComponent },
      {  path: 'proveedores', component: ProveedoresComponent },
      {  path: 'dashboard', component: DashboardComponent  },
      {  path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    ]
  }
];

export const PagesRoutingModule = RouterModule.forChild(pagesRoutes);
