import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  public empleados = [];

  obtenerEmpleados() {
    this.storage.ready().then(() => {
      this.storage.get("empleados").then(data => {
        this.empleados = data;
      })
    })
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.obtenerEmpleados();
  }


}
