import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera'
import moment, { duration } from 'moment';
import 'moment/locale/es';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { EntradaPage } from '../entrada/entrada';
import { SalidaPage } from '../salida/salida';


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
  public entradas:any;
  public salidas:any;
  public keys:any;
  public numero:any;
  public estado:any;
  public pantallaEstado:any;
  public empleadoId:any;
  public tomafoto:any;
  public datosEntradas:any;
  public datosSalida:any;
  public horacorta = moment().format('hh:mm a');
  public foto:string=null;  
  public latitud:any;
  public longitud:any;
  public guardardatos = [];
  public empleados = [];
  public nombre:any; 
  public entrada = {
    empleadoId:"",
    dia:"",
    entrada:"",
    fotoEntrada:"",
    creadoPor:"",
    creadoFecha:"",
    modificadoPor:"",
    modificadoFecha:""
  };
  public salida = {
    salida: "",
    fotoSalida: "",
    modificadoPor: "",
    modificadoFecha: ""
  };

  obtenerEmpleados() {
    let loader = this.loadingCtrl.create({
      content: "Cargando empleados..."
    });
    loader.present();
    this.storage.ready().then(() => {
      this.storage.get("empleados").then(data => {
        this.empleados = data;
      })
    })
    setTimeout(() => {
      loader.dismiss();
    })
  }
  obtenerRegistros(){
    this.storage.ready().then(() => {
      this.storage.get("registros").then(data => {
        this.entradas = data.entradas;
        this.salidas = data.salidas;
      })
    })   
  }

  obtenerEntradas() {
    this.storage.ready().then(() => {
      this.storage.get("entradas").then(data => {
        this.datosEntradas = data;
      })
    })
  }
  obtenerSalidas() {
    this.storage.ready().then(() => {
      this.storage.get("salidas").then(data => {
       this.datosSalida = data;
      })
    })
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, public camara: Camera, public alertCtrl: AlertController,private geolocation: Geolocation,
    public storage: Storage, public modalCtrl: ModalController) {
    this.obtenerEmpleados();
    this.obtenerRegistros();
    this.obtenerEntradas();
    this.obtenerSalidas();
    this.conta = 0;
    this.coordenada();
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
      for(let item of this.empleados){
        if(this.numero == item.pin){
          verificar = 1;   
          this.nombre = item.primerNombre + " " + item.primerApellido;
          this.empleadoId = item.empleadoId;     
          this.tomafoto = item.capturarFoto;  
         }        
      }
      if(verificar == 1){
            if(this.tomafoto == true){
              this.guardarEntrada();
            }else{
            this.guardarEntrada();
            }        
       }else{
        let error = "Datos incorrectos"
        this.MostarToast(error);
        this.clearAll();
      }      
      loader.dismiss();
    }
  }

  guardarEntrada(){    
    this.entrada.empleadoId = this.empleadoId;
    this.entrada.dia = moment().format();
    this.entrada.entrada = moment().format();
    this.entrada.fotoEntrada = this.tomafoto;
    this.entrada.creadoPor = this.nombre;
    this.entrada.creadoFecha = moment().format();
    this.entrada.modificadoPor = this.nombre;
    this.entrada.modificadoFecha = moment().format();

        let arreglo = [];
        if (this.datosEntradas == 'none') {
          arreglo.push(this.entrada);
          this.guardardatos = arreglo;
          this.storage.set('entradas', this.guardardatos);
          this.estado = 'entrada';
          this.entradas = this.entradas + 1;
          this.pantallaEstado = EntradaPage;
        } else {
          let verificar = 0;
          for (let items of this.datosEntradas) {
            if (items.empleadoId == this.empleadoId) {
              verificar = 1
            }
          }
          if (verificar == 0) {
            arreglo = this.datosEntradas;
            arreglo.push(this.entrada);
            this.guardardatos = arreglo;
            this.storage.set('entradas', this.guardardatos);
            this.estado = 'entrada';
            this.entradas = this.entradas + 1;
            this.pantallaEstado = EntradaPage;
          } else {
            this.salida.salida = moment().format();
            this.salida.fotoSalida = this.tomafoto;
            this.salida.modificadoPor = this.nombre;
            this.salida.modificadoFecha = moment().format();
            let salidaFinal = {
              empleadoId: this.empleadoId,
              salida:this.salida
            }

              let arreglo2 = [];
              if (this.datosSalida == 'none') {
                arreglo2.push(salidaFinal);
                this.guardardatos = arreglo2;
                this.storage.set('salidas', this.guardardatos);
                this.estado = 'salida';
                this.salidas = this.salidas + 1;
                this.entradas = this.entradas - 1;
                this.pantallaEstado = SalidaPage;
              } else {
                arreglo2 = this.datosSalida ;
                arreglo2.push(salidaFinal);
                this.guardardatos = arreglo2;
                this.storage.set('salidas', this.guardardatos);
                this.estado = 'salida';
                this.salidas = this.salidas + 1;
                this.entradas = this.entradas - 1;
                this.pantallaEstado = SalidaPage;
              }
          }
        }
        let registro = {
          entradas: this.entradas,
          salidas: this.salidas
        }
        this.storage.set('registros', registro)
        this.presentModal(this.pantallaEstado);
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
      this.guardarEntrada();
    })
    .catch(error =>{
      console.error( error );
    });
  }

  presentModal(pantalla) {
    const modal = this.modalCtrl.create(pantalla,{empleado:this.nombre, estado:this.estado, hora:this.horacorta});
    modal.present();
  }

}
