import { Component } from '@angular/core';
import { map } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseApp } from '@angular/fire';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ordersStream:Observable<any[]>;
  orders: any[];
  constructor(
    private firestore: AngularFirestore,
    private firebase: FirebaseApp,

  ) {

    firebase.firestore().enablePersistence()
      .catch(function (err) {
        if (err.code == 'failed-precondition') {
          console.log('failed-precondition');
        } else if (err.code == 'unimplemented') {
          console.log('failed-unimplemented');
        }
      });

    this.ordersStream = this.firestore.collection('orders').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        console.log(a.payload.doc.metadata.fromCache ? id + ' - Cache' : id+'+ Network' );
        return { id, data };
      }))
    );
    
  }


  ngOnInit(){
    this.ordersStream.subscribe(data=>{
      console.log('orders', data);
      this.orders = data;
    });
    
  }

}
