import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SalidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salida',
  templateUrl: 'salida.html',
})
export class SalidaPage {
  public empleado:any;
  public estado:any;
  public hora:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.empleado = this.navParams.get('empleado');
    this.estado = this.navParams.get('estado');
    this.hora = this.navParams.get('hora');
    this.ngOnInit();
  }

  ngOnInit() {
    setTimeout(() => {
      window.location.reload()
    }, 3000);
  }
}
