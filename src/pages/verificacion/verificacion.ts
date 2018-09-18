import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) { 
    
  }

  ionViewDidLoad() {
  
  }
  
  verificar(){
  this.valor = this.valor1 + this.valor2 + this.valor3 + this.valor4;
  if(this.valor == this.codigo){
   this.presentAlert();
  }else{
    let error = "El codigo ingresado es incorrecto"
    this.MostarToast(error);
    this.limpiar();
  } 
 
  }
  limpiar() {
    this.valor1 = "";
    this.valor2 = "";
    this.valor3 = "";
    this.valor4 = "";
  }

  MostarToast(MensajeError: any) {
    let toast = this.toastCtrl.create({
      message: MensajeError,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: "x"
    });
    toast.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Correcto\n',
      subTitle: 'Su codigo fue ingresado correctamente',
      buttons: [
        {
          text: 'Continuar',
          role: 'Continuar',
          handler: () => {
            this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

}
