import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EntradaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrada',
  templateUrl: 'entrada.html',
})
export class EntradaPage {
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
      // this.navCtrl.popToRoot();
      // might try this instead
      window.location.reload()
    }, 3000);
  }

}
