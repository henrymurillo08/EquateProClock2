import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-administrador',
  templateUrl: 'administrador.html',
})
export class AdministradorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
  }


z
  close(){
    this.viewCtrl.dismiss();
    }
  

}
