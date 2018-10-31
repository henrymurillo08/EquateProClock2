import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Device } from '@ionic-native/device';
import { ConexionProvider } from '../../providers/conexion/conexion';
import { Http } from '@angular/http';
import { TabsPage } from '../tabs/tabs';
import { duration } from 'moment';
@IonicPage()
@Component({
  selector: 'page-verificacion',
  templateUrl: 'verificacion.html',
})
export class VerificacionPage {
  public valor:any;
  public n1: any;
  public n2: any;
  public n3: any;
  public n4: any;
  public conta: any;
  public dispositivo = {
      serial:"",
      plataforma:""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public storage:Storage, private device: Device, public conexion:ConexionProvider, public http: Http, public loadingCtrl: LoadingController) { 
      this.datosDispositivo();
      this.conta = 0;
    
  }

  numeros(valor: any) {
    this.conta = this.conta + 1;
    if (this.conta == 1) {
      this.n1 = "" + valor
      var elem = document.getElementById('primero');
      // agregar clase  
      elem.classList.add('active');
    }

    if (this.conta == 2) {
      this.n2 = "" + valor
      var elem = document.getElementById('segundo');
      // agregar clase  
      elem.classList.add('active');
    }

    if (this.conta == 3) {
      this.n3 = "" + valor
      var elem = document.getElementById('tercero');
      // agregar clase  
      elem.classList.add('active');
    }

    if (this.conta == 4) {
      this.n4 = "" + valor
      var elem = document.getElementById('cuarto');
      // agregar clase  
      elem.classList.add('active');
      this.verificar()
    }
  }
  borrar() {
    if (this.conta >= 0) {
      if (this.conta == 1) {
        this.n1 = ""
        var elem = document.getElementById('primero');
        // agregar clase  
        elem.classList.remove('active');
      }

      if (this.conta == 2) {
        this.n2 = ""
        var elem = document.getElementById('segundo');
        // agregar clase  
        elem.classList.remove('active');
      }

      if (this.conta == 3) {
        this.n3 = ""
        var elem = document.getElementById('tercero');
        // agregar clase  
        elem.classList.remove('active');
      }

      if (this.conta == 4) {
        this.n4 = ""
        var elem = document.getElementById('cuarto');
        // agregar clase  
        elem.classList.remove('active');
      }

      this.conta = this.conta - 1;

    }
  } 

  clearAll() {
    this.conta = 0;
    document.getElementById('primero').classList.remove('active');
    document.getElementById('segundo').classList.remove('active');
    document.getElementById('tercero').classList.remove('active');
    document.getElementById('cuarto').classList.remove('active');
    this.n1 = ""
    this.n2 = ""
    this.n3 = ""
    this.n4 = ""
  }


  datosDispositivo(){
    this.dispositivo.serial = this.device.serial;
    this.dispositivo.plataforma = this.device.platform;
  }
 
  
  verificar(){
  this.valor = this.n1 + this.n2 + this.n3 + this.n4;
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
      this.clearAll();
      this.MostarToast(err);
    }else{
      this.storage.set('Dispositivo', this.dispositivo);
      this.storage.set('cliente', data);
      this.storage.set('usuario', 'none');
      this.storage.set('registros', 'none');
      this.empleados();
      this.presentAlert();
    }
    loader.dismiss();
  })
  }


  empleados(){
    let direccion =this.conexion.Url + "empleados";
    this.http.get(direccion)
    .map(resp => resp.json())
    .subscribe(data=>{
      this.storage.set("empleados", data)
    })
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
            this.navCtrl.push(TabsPage);
          }
        }
      ]
    });
    alert.present();
  }

}
