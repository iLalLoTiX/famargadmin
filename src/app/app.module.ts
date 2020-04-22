import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Servicios
import { OrdenServicio } from './servicios/ordenes.service'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { PagesComponent } from './pages/pages.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    LoginComponent,
    DashboardComponent,
    ProveedoresComponent,
    ProductosComponent,
    PagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [
    OrdenServicio
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
