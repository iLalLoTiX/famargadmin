import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore' ;
import { caja } from '../interfaces/cajas.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  private itemsCollection: AngularFirestoreCollection<any>;
  public B: number = 0;
  constructor(public afs: AngularFirestore) { }

  cargarCajas(){
    this.itemsCollection = this.afs.collection<any>('cajasData').doc('inventarioCajas').collection<any>('cajas');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      this.B = 0;
      return actions.map(a => {
        this.B = a.payload.doc.data()['cantidad'] + this.B;
        return a;
        });
      }));
  }

  prueba(id: string, cajas: number){
    let afuera: number = 0;
    let adentro: number = 0;

    this.afs.collection('cajasData')
    .doc('inventarioCajas').collection('cajas')
    .doc(id).get().subscribe(a => {
      adentro = a.data()['adentro'] - cajas;
      afuera = a.data()['afuera'] + cajas;
      return this.afs.collection('cajasData')
                      .doc('inventarioCajas').collection('cajas')
                      .doc(id).update({adentro: adentro,
                                      afuera: afuera});
    });
   }  

  agregarCaja(cajaItem: caja)
  {
    // tslint:disable-next-line: no-shadowed-variable
    const enviarNuevaCaja: caja = {...cajaItem};
    console.log(enviarNuevaCaja.id);
    return this.afs.collection('cajasData').doc('inventarioCajas').collection('cajas').doc(enviarNuevaCaja.id).set(enviarNuevaCaja);
  }

  borrarCaja(id: string){
    return this.afs.collection('cajasData').doc('inventarioCajas').collection('cajas').doc(id).delete();
  }

  ponerCaja(id: string)
  {
    return this.afs.collection('cajasData').doc('inventarioCajas').collection('cajas').doc(id).get();
  }

  actualizarCaja(id: string, cajaItem: caja){
    let enviarActCaja: caja = {
      ...cajaItem
    }
    return this.afs.collection('cajasData').doc('inventarioCajas').collection('cajas').doc(id).set(enviarActCaja);
  }
}
