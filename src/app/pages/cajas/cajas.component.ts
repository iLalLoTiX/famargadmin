import { Component } from '@angular/core';
import { caja } from '../../interfaces/cajas.interface';
import { NgForm} from '@angular/forms';
import { CajasService } from 'src/app/services/cajas.service';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
})
export class CajasComponent{

  public cajaItem = new caja;
  public cajas;
  public idCaja: string;
  public cajasTotales: number;

  constructor(public cs_: CajasService) {
    this.cs_.cargarCajas().subscribe( a => {this.cajas = a ; });
    this.cajasTotales = this.cs_.B;
  }

  agregarCaja(form: NgForm){
    if((this.cajaItem.afuera + this.cajaItem.adentro) != this.cajaItem.cantidad){
      alert("la cantidad ingresada no es igual a la suma de cajas en el inventario y cajas que estan de viaje");
      
      return;
    }
    if(form.invalid){
      Object.values(form.controls).forEach(control => {control.markAsTouched();});
      return;
    }
    if(this.idCaja==null){
      this.cs_.agregarCaja(this.cajaItem);
      this.limpiar(form);
      return;
    }
    else{
      this.cs_.actualizarCaja(this.idCaja, this.cajaItem);
      this.limpiar(form);
      return;
    }
  }

  limpiar(form: NgForm){
    form.reset({});
  }

  borrarCaja(id: string){
    this.cs_.borrarCaja(id);
    return;
  }

  mostrarCaja(id: string){
    
    this.cs_.ponerCaja(id).subscribe((a: any) => 
    {
      this.cajaItem = a.data(),
      this.idCaja = a.id;
    }
    );
    return;
  }

}
