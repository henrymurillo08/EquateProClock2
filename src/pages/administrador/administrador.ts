import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-administrador',
  templateUrl: 'administrador.html',
})
export class AdministradorPage {

  public usuario:any;
  public pass:any;
  public User:any;
  public Contrasena:any;

  obtenerDispositivo() {
    this.storage.ready().then(() => {
      this.storage.get("cliente").then(data => {
        this.usuario = data.username;
        this.pass = data.contrasena;
      })
    })
  }



  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public storage: Storage) {
    this.obtenerDispositivo();
  }


  loguear(){
    if(this.User == this.usuario && this.Contrasena == this.pass){
      this.navCtrl.push(ConfiguracionPage);
    }else{
      let err = "El usuario o la contraseña son incorrectos";
      this.MostarToast(err);
    }
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

}
