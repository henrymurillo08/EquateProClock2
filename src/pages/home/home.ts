import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import moment from 'moment';
import 'moment/locale/es';
import { AdministradorPage } from '../administrador/administrador';
import { Storage } from '@ionic/storage'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public nombre_empresa:any 
  public fecha:any;
  public entradas:any;
  public salidas:any;
 

  obtenerDatos(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.nombre_empresa = data.nombre;
      })
    })   
  }
  obtenerRegistros(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("registros").then(data => {
        this.entradas = data.entradas;
        this.salidas = data.salidas;
      })
    })   
  }

  constructor(public navCtrl: NavController, public modalCtrl:ModalController, public storageCrtl:Storage) {
    this.obtenerDatos();
    this.obtenerRegistros();
    this.fecha = moment().format('LL');
    setInterval(this.update, 1000);
  }
  configuracion(){
  this.navCtrl.push(AdministradorPage);
  }
  
  update() {
     document.getElementById("hora")
    .innerHTML = moment().format(' h:mm:ss a');
}


}
