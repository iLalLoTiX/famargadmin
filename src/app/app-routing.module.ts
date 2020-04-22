import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  
  {  path: 'login', component: LoginComponent },
  {  path: '**', redirectTo: '/login'}
];

export const AppRoutingModule = RouterModule.forRoot(routes, {useHash: true});
