import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

// Modelos
import { EntradaProducto } from '../interfaces/entradaProducto.interface';
import { Orden } from '../interfaces/orden.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  public entradasCollection: AngularFirestoreCollection<any>;

  // Modelo
  public enviarProducto = new EntradaProducto();

  constructor( public fb_: AngularFirestore) {

  }

  ordenesRecientes(){
    this.entradasCollection = this.fb_.collection<any>('ordenes');
    return this.entradasCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {

        return a;

        });
      }));
  }

  // Aumenta en 1 cada vez que agregamos una orden
  generarId(){
    return this.fb_.collection('idGen').doc('generateIdEntradas').get();
  }

  // Sirve para mostrar las ordenes en el ordenes.component.ts
  recuperarOrdenProducto(id: string){
    return this.fb_.collection('ordenes').doc(id)
    .collection('ordenProductos').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  // Es para recuperar los datos de una sola Orden
  recuperarOrden(id: string){
    return this.fb_.collection('ordenes').doc(id).get();
  }

  // Es para recuperar los datos de un solo proveedor
  recuperarProveedor(id: string){
    return this.fb_.collection('proveedores').doc(id).get();
  }

  agregarOrden(ordenEntrante: Orden, productos: any [], idGen: number)
  {
    console.log('owo');
    const enviarOrden: Orden = { ...ordenEntrante };
    if (enviarOrden.id === undefined){
      enviarOrden.id = idGen.toString();
    }
    this.fb_.collection('ordenes').doc(enviarOrden.id).set(enviarOrden);

    productos.forEach( a =>
      {
        const enviarProducto: EntradaProducto =
        {
          ...a
        };

        this.fb_.collection('idGen').doc('generateIdEntradas').update({id: idGen});
        
        this.fb_.collection('ordenes').doc(enviarOrden.id).collection('ordenProductos')
        .doc(enviarProducto.idProducto).set(enviarProducto);
    });
  }

  borrarOrden(id: string){
    return this.fb_.collection('ordenes').doc(id).delete();
  }

}

