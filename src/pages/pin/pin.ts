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
  public datosEntradas =[];
  public datosSalida= [];
  public fecha:any;
  public horacorta = moment().format('hh:mm a');
  public foto:string="";  
  public latitud:any;
  public longitud:any;
  public guardardatos = [];
  public empleados = [];
  public nombre:any; 
  public dispositivoId:any;
  public dispositivoNombre:any;
  public entrada = {
    creadoFecha: "",
    creadoPor: "",
    dia: "",
    eliminado:false,
    dispositivoId:0,  
    empleadoId:"",
    entrada: "",
    entradaAlterada: false,
    salidaAlterada: false,
    fotoEntrada: false,
    fotosalida: false,
    horas: 0,
    foto64: "",
    manualEntrada: false,
    manualsalida: false,
    tipoMarca:"P",
    modificadoPor: "",
    modificadoFecha: "",
    precio:0,
    total:0    
  };
  public salida = {
    creadoFecha: "",
    creadoPor: "",
    dia: "",
    eliminado: false,
    dispositivoId: 0,
    empleadoId: "",
    salida: "",
    entradaAlterada: false,
    salidaAlterada: false,
    fotoEntrada: false,
    fotosalida: false,
    horas: 0,
    foto64: "",
    manualEntrada: false,
    manualsalida: false,
    tipoMarca: "P",
    modificadoPor: "",
    modificadoFecha: "",
    precio: 0,
    total: 0    
  };

  obtenerDispositivo() {
    this.storage.ready().then(() => {
      this.storage.get("cliente").then(data => {
        this.dispositivoId = data.dispositivoId;
        this.dispositivoNombre = data.nombre;
      })
    })
  }

  obtenerEmpleados() {
    this.storage.ready().then(() => {
      this.storage.get("empleados").then(data => {
        this.empleados = data;
      })
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
    this.obtenerDispositivo();
    this.obtenerEmpleados();
    this.obtenerRegistros();
    this.obtenerEntradas();
    this.obtenerSalidas();
    this.conta = navParams.data
    this.coordenada();
  }

  numeros(valor: any) {
    this.conta = this.conta + 1;
    if (this.conta == 1) {
      this.n1 = "" + valor
    }

    if (this.conta == 2) {
      this.n2 = "" + valor
    }

    if (this.conta == 3) {
      this.n3 = "" + valor
    }

    if (this.conta == 4) {
      this.n4 = "" + valor
      this.Login()
    }
  }

  borrar() {
    if (this.conta >= 0) {
      if (this.conta == 1) {
        this.n1 = "";
      }

      if (this.conta == 2) {
        this.n2 = "";
      }

      if (this.conta == 3) {
        this.n3 = "";
      }

      if (this.conta == 4) {
        this.n4 = "";
      }

      this.conta = this.conta - 1;

    }
  } 

  clearAll() {
    this.conta = 0;
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
             this.getPicture();
            }else{
            this.guardarEntrada();
            }        
       }else{
        let error = "Datos incorrectos"
        this.MostarToast(error);
        this.clearAll();
      }      
      setTimeout(() => {
        loader.dismiss();
      }, 1000);
    }
  }

  guardarEntrada(){    
   
    this.entrada.empleadoId = this.empleadoId;
    this.entrada.dia = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.entrada = moment().format("MM/DD/YYYY hh:mm a");
    this.entrada.fotoEntrada = this.tomafoto;
    this.entrada.creadoPor = "tablet01";
    this.entrada.creadoFecha = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.modificadoPor = "tablet01";    
    this.entrada.modificadoFecha = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.dispositivoId = this.dispositivoId;
    this.entrada.foto64 = this.foto;
    let entradaFinal = {
      empleadoId: this.empleadoId,
      estado:'noEnviado',
      entrada:this.entrada
    }
        let arreglo = [];
        if (this.datosEntradas.length == 0) {
          arreglo.push(entradaFinal);
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
            arreglo.push(entradaFinal);
            this.guardardatos = arreglo;
            this.storage.set('entradas', this.guardardatos);
            this.estado = 'entrada';
            this.entradas = this.entradas + 1;
            this.pantallaEstado = EntradaPage;
          } else {
            this.salida.dispositivoId = this.dispositivoId;
            this.salida.empleadoId = this.empleadoId;
            this.salida.salida = moment().format("MM/DD/YYYY hh:mm a");
            this.salida.fotosalida = this.tomafoto;
            this.salida.creadoPor = "tablet01";    
            this.salida.modificadoPor = "tablet01";    
            this.salida.modificadoFecha = moment().format("YYYY-MM-DD hh:mm a");
            this.salida.foto64 = this.foto;
            let salidaFinal = {
              empleadoId: this.empleadoId,
              salida:this.salida
            }

              let arreglo2 = [];
              if (this.datosSalida.length == 0) {
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
        this.clearAll();
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
      duration: 1000,
      showCloseButton: true,
      closeButtonText: "x"
    });
    toast.present();
  }

  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camara.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      quality: 50
    }
    this.camara.getPicture( options )
    .then(imageData => {
      this.foto = imageData;
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
