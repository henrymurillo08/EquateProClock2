import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PinPage } from '../pin/pin';
import moment from 'moment';
import 'moment/locale/es';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public nombre_empresa:any = "Dimerca";
  public fecha:any;
  public hora:any;


  constructor(public navCtrl: NavController) {
    this.fecha = moment().format('LL');
    this.hora = moment().format('hh:mm a');
      
  }
  irPinPage(){
    this.navCtrl.push(PinPage);
  }

}
