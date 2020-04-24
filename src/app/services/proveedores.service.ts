import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore' ;
import { proveedor } from '../interfaces/proveedores.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private itemsCollection: AngularFirestoreCollection<any>;
  public tablaProveedores: proveedor[] = [];
  public mostrarProveedorAct: proveedor[] = [];

  constructor(public afs: AngularFirestore) { }

  cargarProveeores(){
    this.itemsCollection = this.afs.collection<proveedor>('proveedores');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  agregarProveedor(proveedor: proveedor)
    {
      // tslint:disable-next-line: no-shadowed-variable
      const enviarNuevoProveedor: proveedor = {
        ...proveedor
    }
      return this.afs.collection('proveedores').add(enviarNuevoProveedor);
  }

  borrarProveedor(id: string){
    return this.afs.collection('proveedores').doc(id).delete();
  }

  ponerProveedor(id: string)
  {
    return this.afs.collection('proveedores').doc(id).get();
  }

  actualizarProveedor(id: string, proveedor: proveedor){
    let enviarActProv: proveedor = {
      ...proveedor
    }
    return this.afs
    .collection("proveedores")
    .doc(id)
    .set(enviarActProv);
  }
}
