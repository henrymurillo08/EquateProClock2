import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the VerificacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verificacion',
  templateUrl: 'verificacion.html',
})
export class VerificacionPage {
  public codigo:any = 'k7v5';
  public valor1:any;
  public valor2:any;
  public valor3:any;
  public valor4:any;
  public valor:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.verificar();
  }

  ionViewDidLoad() {

  }
  
  verificar(){
  this.valor = this.valor1 + this.valor2 + this.valor3 + this.valor4;
  if(this.valor == this.codigo){
    this.navCtrl.push(HomePage);
  }else{
    console.log(false);
  }
  this.valor1 = "";
  this.valor2 = "";
  this.valor3= "";
  this.valor4 = "";
  }

}
