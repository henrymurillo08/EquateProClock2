import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PinPage } from '../pin/pin';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public nombre_empresa:any = "EquatePro";
  public fecha:any;
  public hora:any;


  constructor(public navCtrl: NavController) {
    this.fecha = new Date().toISOString();
    this.hora = new Date().toLocaleTimeString();
  }
  irPinPage(){
    this.navCtrl.push(PinPage);
  }

}
