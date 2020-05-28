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

  // variables temporales
  public idGen: number;


  constructor( public fb_: AngularFirestore) {
    this.generarId();
  }

  ordenesRecientes(){
    this.entradasCollection = this.fb_.collection<any>('ordenes');
    return this.entradasCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {

        return a;

        });
      }));
  }

  generarId(){
    return this.fb_.collection('idGen').doc('generateIdEntradas').get()
    .subscribe(a => {
      this.idGen = a.data()['id'] + 1; });
  }

  recuperarOrdenProducto(id: string){
    return this.fb_.collection('ordenes').doc(id)
    .collection('ordenProductos').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  recuperarOrden(id: string){
    return this.fb_.collection('ordenes').doc(id).get();
  }

  recuperarProveedor(id: string){
    return this.fb_.collection('proveedores').doc(id).get();
  }

  agregarOrden(ordenEntrante: Orden, arrayProducto: any [])
  {

    console.log(arrayProducto);
    
    const enviarProveedor: Orden = { ...ordenEntrante };

    this.fb_.collection('ordenes').doc(this.idGen.toString()).set(enviarProveedor);

    arrayProducto.forEach( a =>
      {
        const enviarProducto: EntradaProducto =
        {
          idProducto : a[0],
          producto : a[1],
          peso : a[2],
          precio : a[3]
        };

        this.fb_.collection('idGen').doc('generateIdEntradas').update({id: this.idGen});

        this.fb_.collection('ordenes').doc(this.idGen.toString()).collection('ordenProductos')
        .doc(enviarProducto.idProducto).set(enviarProducto);
    });
    this.generarId();
  }

}

