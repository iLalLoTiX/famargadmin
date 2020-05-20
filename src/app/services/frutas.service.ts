import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore' ;
import { producto } from '../interfaces/producto.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrutasServices {
  public ordenes: producto[] = [];

  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(public afs: AngularFirestore) { }



  cargarProductos(){
    this.itemsCollection = this.afs.collection<producto>('productos');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  agregarProducto(idProducto: string, producto: producto)
  {
    const enviarProductos: producto = {
      ...producto
    }
    return this.afs.collection('productos').doc(idProducto).set(enviarProductos);
  }

  editarProducto(id: string)
  {
    return this.afs.collection('productos').doc(id).get();
  }

  borrarProducto(id:string){
    return this.afs
    .collection('productos')
    .doc(id)
    .delete();
  }

  actualizarProducto(id: string, producto: producto){
    let enviarActProd: producto = {
      ...producto
    }
    return this.afs.collection('productos').doc(id).set(enviarActProd);
  }
}
