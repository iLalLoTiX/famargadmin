import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore' ;
import { orden } from '../interfaces/orden.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicio {
  public ordenes: orden[] = [];

  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(public afs: AngularFirestore) { }



  cargarTabla(){
    this.itemsCollection = this.afs.collection<orden>('items');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  agregarPedido(texto:string){
    let mensaje: orden = {
      nombre:'yayo',
      mensaje: texto,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add(mensaje);
  }

  actualizarPedido(id: string, texto:string){
    let mensaje: orden = {
      nombre:'yayo',
      mensaje: texto,
      fecha: new Date().getTime()
    }
    return this.afs
    .collection("items")
    .doc(id)
    .set(mensaje);
  }

  borrarPedido(id:string){
    return this.afs
    .collection("items")
    .doc(id)
    .delete();
  }
}
