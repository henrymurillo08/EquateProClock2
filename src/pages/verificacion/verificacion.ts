import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Device } from '@ionic-native/device';
import { ConexionProvider } from '../../providers/conexion/conexion';
import { Http } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
@IonicPage()
@Component({
  selector: 'page-verificacion',
  templateUrl: 'verificacion.html',
})
export class VerificacionPage {
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
    public storage:Storage, private device: Device, public conexion:ConexionProvider, public http: Http, public loadingCtrl: LoadingController) { 
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
  let direccion = this.conexion.Url + "dispositivos/verifica/" + this.valor;
  this.http.get(direccion)
  .map(resp => resp.json())
  .subscribe(data =>{
    let loader = this.loadingCtrl.create({
      content: "verificando codigo ...",
    });
    loader.present();
    if(!data){
      let err = "El codigo ingresado es incorrecto";
      this.limpiar();
      this.MostarToast(err);
    }else{
      this.storage.set('Dispositivo', this.dispositivo);
      this.storage.set('cliente', data);
      this.storage.set('usuario', 'none');
      this.presentAlert();
    }
    loader.dismiss();
  })
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
            this.navCtrl.push(TabsPage);
          }
        }
      ]
    });
    alert.present();
  }

}
