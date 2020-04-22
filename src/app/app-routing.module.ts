import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { PagesComponent } from './pages/pages.component';


const routes: Routes = [
  {  
    path: '', 
    component: PagesComponent ,
    children: [
      {  path: 'productos', component: ProductosComponent },
      {  path: 'proveedores', component: ProveedoresComponent },
      {  path: 'dashboard', component: DashboardComponent  },
      {  path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    ] 
  },
  {  path: 'login', component: LoginComponent },

  //{  path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {  path: '**', redirectTo: '/dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
