import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera'
import { HomePage } from '../home/home';
import moment from 'moment';
import 'moment/locale/es';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';


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
  public keys:any;
  public numero:any;
  public estado:any;
  public tomafoto:boolean = true;
  public pin = [
    1234, 2345, 3456, 4567
  ];
  public horalarga = moment().format('HH:mm');
  public horacorta = moment().format('hh:mm a');
  public foto:string=null;  
  public latitud:any;
  public longitud:any;
  public guardardatos = [];
  public fecha =  moment().format('YYYY-MM-DD');    
  public datos = {
    pin:"",
    longitud:"",
    latitud:"",
    entrada:"",
    salida:"",
    fecha:"",
    estado:"",
    foto_entrada:"",
    foto_salida:""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, public camara: Camera, public alertCtrl: AlertController,private geolocation: Geolocation,
    public storage: Storage) {
    this.conta = 0;
    this.coordenada();
  }

  ionViewDidLoad() {
  
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
      this.numero = this.n1.concat(this.n2, this.n3, this.n4);
      let verificar = 0;
      for(let pin of this.pin){
        if(this.numero == pin){
          verificar = 1;          
         }        
      }
      if(verificar == 1){
            if(this.tomafoto){
              this.getPicture();
              this.guardar();
            }else{
              this.guardar();
            }        
       }else{
        let error = "Datos incorrectos"
        this.MostarToast(error);
        this.clearAll();
      }      
      loader.dismiss();
    }
  }

  guardar(){

    this.datos.entrada = this.horalarga
    this.datos.latitud = this.latitud;
    this.datos.longitud = this.longitud;
    this.datos.pin = this.numero;
    this.datos.fecha =  moment().format('YYYY-MM-DD'); 
    this.datos.estado = 'entrada';
    this.datos.foto_entrada = this.foto;

    this.storage.ready().then(()=>{
      this.storage.get('usuario').then(val =>{
        let arreglo = [];
        if(val == 'none'){
          arreglo.push(this.datos);
          this.guardardatos = arreglo;
          this.storage.set('usuario', this.guardardatos);
          this.estado = 'entrada';
        }else{
          let cont = 0;
          let posicion = 0;
          let verificar =0;
          for(let items of val){
            if(items.pin == this.numero && items.fecha == this.fecha){
              posicion = cont;
              verificar = 1
            }
            cont = cont + 1;
          }
          if(verificar == 0){
            arreglo = val;
            arreglo.push(this.datos);
            this.guardardatos = arreglo;
            this.storage.set('usuario', this.guardardatos);
          this.estado = 'entrada';

          }else{
            val[posicion]['salida'] = this.horalarga;
            val[posicion]['foto_salida'] = this.foto;
            val[posicion]['estado'] = "salida";
            arreglo = val
            this.guardardatos = arreglo;
            this.storage.set('usuario', this.guardardatos);
            this.estado = 'salida';
          }
        }
        this.presentAlert();
      })
    })
   this.clearAll();
  }

  coordenada(){
    this.geolocation.getCurrentPosition().then((resp)=> {
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
    }).catch((error) => {
      let err = "Error al obtener las coordenadas";
      this.MostarToast(err);
    });
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
    })
    .catch(error =>{
      console.error( error );
    });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Correcto',
      subTitle: 'Se registro su ' + this.estado + ' a la hora: ' + this.horacorta,
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
