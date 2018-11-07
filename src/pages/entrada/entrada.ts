import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-entrada',
  templateUrl: 'entrada.html',
})
export class EntradaPage {
  public empleado:any;
  public estado:any;
  public hora:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.empleado = this.navParams.get('empleado');
    this.estado = this.navParams.get('estado');
    this.hora = this.navParams.get('hora');
    this.ngOnInit();
  }

  ngOnInit() {
    setTimeout(() => {
     this.navCtrl.push(TabsPage);
    }, 3000);
  }

 
}
