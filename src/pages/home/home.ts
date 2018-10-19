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
  public hora:any;

  obtenerDatos(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.nombre_empresa = data.nombre;
      })
    })   
  }

  constructor(public navCtrl: NavController, public modalCtrl:ModalController, public storageCrtl:Storage) {
    this.obtenerDatos();
    this.fecha = moment().format('LL');
    this.hora = moment().format('hh:mm a');
      
  }
  configuracion(){
  this.navCtrl.push(AdministradorPage);
  }



}
