import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Device } from '@ionic-native/device';
import { ConexionProvider } from '../../providers/conexion/conexion';
import { Http } from '@angular/http';
import moment from 'moment';
import 'moment/locale/es';
import { HomePage } from '../home/home';
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
  public companiaid:any;
  public clienteId: any;
  public datosEmpleados = [];
  public registros = {
    entradas:0,
    salidas:0
  }
  public dispositivo = {
      serial:"",
      plataforma:""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public storage:Storage, private device: Device, public conexion:ConexionProvider, public http: Http, public loadingCtrl: LoadingController) { 
      this.conta = 0;
    
  }

  numeros(valor: any) {
    this.conta = this.conta + 1;
    if (this.conta == 1) {
      this.n1 = "" + valor;
      var element = <HTMLInputElement>document.getElementById("primero");
      element.checked = true;
    }
    else if (this.conta == 2) {
      this.n2 = "" + valor;
      var element = <HTMLInputElement>document.getElementById("segundo");
      element.checked = true;
    }
    else if (this.conta == 3) {
      this.n3 = "" + valor;
      var element = <HTMLInputElement>document.getElementById("tercero");
      element.checked = true;
    }
    else if (this.conta == 4) {
      this.n4 = "" + valor;
      var element = <HTMLInputElement>document.getElementById("cuarto");
      element.checked = true;
      let loader = this.loadingCtrl.create({
        content: "verificando codigo ..."
      });
      loader.present();
      this.verificar()
      setTimeout(() => {
        loader.dismiss();
      }, 2000)
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
    this.n1 = "";
    this.n2 = "";
    this.n3 = "";
    this.n4 = "";
    var element1 = <HTMLInputElement>document.getElementById("primero");
    var element2 = <HTMLInputElement>document.getElementById("segundo");
    var element3 = <HTMLInputElement>document.getElementById("tercero");
    var element4 = <HTMLInputElement>document.getElementById("cuarto");
    element1.checked = false;
    element2.checked = false;
    element3.checked = false;
    element4.checked = false;
  }

  enviarDatosDisp(dispositivoId, nombre){
    let direccion = this.conexion.Url + "dispositivo/datos/" + dispositivoId;
    let infoDispo = {
      ultimaTransmision: moment().format("YYYY-MM-DD hh:mm"),
      version: this.device.version,
      serieNo: this.device.serial,
      modificadoPor: nombre,
      modificadoFecha: moment().format("YYYY-MM-DD hh:mm")
    }
    this.http.patch(direccion, infoDispo)
      .subscribe(respuesta => {
      })
  }
 
  
  verificar(){
  this.valor = this.n1 + this.n2 + this.n3 + this.n4;
  let direccion = this.conexion.Url + "dispositivos/verifica/" + this.valor;
  this.http.get(direccion)
  .map(resp => resp.json())
  .subscribe(data =>{
    if(!data){
      let err = "El codigo ingresado es incorrecto";
      this.clearAll();
      this.MostarToast(err);
    }else{
      this.companiaid = data.companiaId;
      this.clienteId = data.clienteId;
      this.storage.set('cliente', data);
      this.storage.set('registros', this.registros);
      this.storage.set('entradas', '');
      this.storage.set('salidas', '');
      this.enviarDatosDisp(data.dispositivoId, data.sucursal);
      this.empleados();
      this.presentAlert();
    }   
  })
  }


  empleados(){
    let cont = 0;
    let direccion =this.conexion.Url + "empleados/compania/" + this.companiaid + "/sucursal/" + this.clienteId;
    this.http.get(direccion)
    .map(resp => resp.json())
    .subscribe(data=>{
      this.storage.set('empleados', data);
    })
  }



  MostarToast(MensajeError: any) {
    let toast = this.toastCtrl.create({
      message: MensajeError,
      duration: 2000,
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
