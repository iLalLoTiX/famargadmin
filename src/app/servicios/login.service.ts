import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../interfaces/usuario.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private api = 'AIzaSyBB8LbjhrExxKHlyec4SuDswdGdPiTisTs';
  userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  login(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.api}`, 
      authData 
      ).pipe(
        map( resp => {
          this.guardarToken(resp['idToken']);
          return resp;
    })
    );
  }

  private guardarToken (idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else{
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {

    return this.userToken.length > 2;
  
    }

    logout(){
      localStorage.removeItem('token')
    }

}

