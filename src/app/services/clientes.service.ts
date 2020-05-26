import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore' ;
import { Clientes } from '../interfaces/clientes.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private itemsCollection: AngularFirestoreCollection<any>;
  public resultadoBusqueda;

  constructor(public afs: AngularFirestore) { }

  cargarClientes(){
    this.itemsCollection = this.afs.collection<Clientes>('clientes');
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a;
        });
      }));
  }

  agregarCliente(proveedor: Clientes)
  {
      // tslint:disable-next-line: no-shadowed-variable
      const enviarNuevoProveedor: Clientes = {...proveedor}
      return this.afs.collection('clientes').doc(enviarNuevoProveedor.id).set(enviarNuevoProveedor);
  }

  borrarCliente(id: string){
    return this.afs.collection('clientes').doc(id).delete();
  }

  editarCliente(id: string)
  {
    return this.afs.collection('clientes').doc(id).get();
  }

  actualizarCliente(id: string, cliente: Clientes){
    let enviarActClient: Clientes = {
      ...cliente
    }
    return this.afs
    .collection('clientes')
    .doc(id)
    .set(enviarActClient);
  }

  buscarCliente(buscar: string){

      return this.afs.collection('clientes', ref => ref.where('id', '==', buscar)).valueChanges();

  }

}
