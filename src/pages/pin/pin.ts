import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera'
import { HomePage } from '../home/home';
import moment from 'moment';
import 'moment/locale/es';

/**
 * Generated class for the PinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pin',
  templateUrl: 'pin.html',
})
export class PinPage {

  public n1: any;
  public n2: any;
  public n3: any;
  public n4: any;
  public conta: any;
  public pin = 1234;
  public hora:any
  public fecha:any;
  public foto:string=null;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, public camara: Camera, public alertCtrl: AlertController) {
    this.conta = 0;
  }

  ionViewDidLoad() {
  
  }
  numero(valor: any) {
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
      this.Login()
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

  Login() {

    if (!this.n1 || !this.n2 || !this.n3 || !this.n4) {
      let err = "Debe llenar todos los campos"
      this.MostarToast(err);
      this.clearAll();
    } else {
      let loader = this.loadingCtrl.create({
        content: "verificando datos ...",
      });
      loader.present();
      let numero = this.n1.concat(this.n2, this.n3, this.n4);
      if(numero == this.pin){
        this.fecha = moment().format('LL');
        this.hora = moment().format('hh:mm a');
        console.log(this.hora);
        console.log(this.fecha);
        this.getPicture();
        this.clearAll();
      }else{
        let error = "Datos incorrectos"
        this.MostarToast(error);
        this.clearAll();
      }
      
      loader.dismiss();
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

  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camara.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camara.getPicture( options )
    .then(imageData => {
      this.foto = `data:image/png;base64,${imageData}`;
      this.presentAlert();
    })
    .catch(error =>{
      console.error( error );
    });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Correcto\n',
      subTitle: 'Su hora de entrada fue a las: ' + this.hora,
      message: this.foto,
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
