import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Device } from '@ionic-native/device';

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
  public dispositivo = {
      serial:"",
      plataforma:""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public storage:Storage, private device: Device ) { 
      this.datosDispositivo();
    
  }

  ionViewDidLoad() {
  
  }


  datosDispositivo(){
    this.dispositivo.serial = this.device.serial;
    this.dispositivo.plataforma = this.device.platform;
  }
 
  
  verificar(){
  this.valor = this.valor1 + this.valor2 + this.valor3 + this.valor4;
  if(this.valor == this.codigo){
    this.storage.set('Dispositivo', this.dispositivo);
    this.storage.set('usuario', 'none');
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
      message: 'serial: ' +  this.dispositivo.serial + ' ' + 'plataforma: ' + this.dispositivo.plataforma,
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
