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



  cargarTabla(){
    this.itemsCollection = this.afs.collection<producto>('productos');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  agregarPedido(idInterno: string,
                sku: string,
                // tslint:disable-next-line: no-shadowed-variable
                producto: string,
                categoria: string,
                sat: string,)
  {
    const fruta: producto = {
      idInterno,
      sku,
      producto,
      categoria,
      sat,
    }
    return this.itemsCollection.add(fruta);
  }

  borrarPedido(id:string){
    return this.afs
    .collection("productos")
    .doc(id)
    .delete();
  }
}
