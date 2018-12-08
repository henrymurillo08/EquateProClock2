import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { EmpleadoPage } from '../empleado/empleado';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.obtenerEmpleados();
  }

  getItems(ev: any) {

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.empleados = this.empleados.filter((item) => {
        let value = (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })
    } else {
      this.obtenerEmpleados();
    }
  }

  enviar(id,nombre,foto,posicion){
    this.navCtrl.push(EmpleadoPage, { empleadoId: id, nombre: nombre, foto: foto, posicion: posicion})
  }


}
