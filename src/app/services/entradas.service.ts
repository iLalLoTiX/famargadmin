import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

// Modelos
import { EntradaProducto } from '../interfaces/entradaProducto.interface';
import { EntradaProveedor } from '../interfaces/entradaProveedor.interface';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  public entradasCollection: AngularFirestoreCollection<any>;

  // Modelo
  public enviarProducto = new EntradaProducto;

  // variables temporales
  public idGen: number;


  constructor( public fb_: AngularFirestore) {
    this.generarId();
  }

  entradasRecientes(){
    this.entradasCollection = this.fb_.collection<any>('entradas');
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

  productoEntrante(id: string){
    return this.fb_.collection('entradas').doc(id)
    .collection('entradaProductos').snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  recuperarEntrada(id: string){
    return this.fb_.collection('entradas').doc(id).get();
  }

  recuperarProveedor(id: string){
    return this.fb_.collection('proveedores').doc(id).get();
  }

  recuperar(){

    this.entradasCollection = this.fb_.collection<EntradaProveedor>('entradas', ref => ref.where('nombreProveedor', '==', 'Eduardo V'));
    return this.entradasCollection.snapshotChanges().pipe(map(action => {
      return action.map(a => {
        console.log(a.payload.doc.data()['nombreProveedor']);
        return a;
      });
    }));

  }

  agregarEntradaProveedor(proveedorEntrante: EntradaProveedor, arrayProducto: any [])
  {
    const enviarProveedor: EntradaProveedor = { ...proveedorEntrante };

    this.fb_.collection('entradas').doc(this.idGen.toString()).set(enviarProveedor);

    arrayProducto.forEach( a =>
      {
        const enviarProducto: EntradaProducto =
        {
          producto : a[0],
          idProducto : a[0],
          peso : a[1],
          precio : a[3]
        };
        let total = 0;
        this.fb_.collection('productos').doc(enviarProducto.idProducto).get().subscribe( a => {

        total = a.data()['inventario'] + enviarProducto.peso;

        this.fb_.collection('productos').doc(enviarProducto.idProducto).update({inventario : total});

        });

        this.fb_.collection('idGen').doc('generateIdEntradas').update({id: this.idGen});

        this.fb_.collection('entradas').doc(this.idGen.toString()).collection('entradaProductos').add(enviarProducto);
    });
    this.generarId();
  }

}
