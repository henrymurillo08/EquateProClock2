import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera'
import moment from 'moment';
import 'moment/locale/es';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { EntradaPage } from '../entrada/entrada';
import { SalidaPage } from '../salida/salida';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-codigo-qr',
  templateUrl: 'codigo-qr.html',
})
export class CodigoQrPage {

  public dispositivoId: any;
  public dispositivoNombre: any;
  public escaneandoQr:string;
  public empleados= [];
  public entradas: any;
  public salidas: any;
  public estado: any;
  public pantallaEstado: any;
  public empleadoId: any;
  public tomafoto: any;
  public datosEntradas = [];
  public datosSalida = [];
  public horacorta = moment().format('hh:mm a');
  public foto: string = null;
  public guardardatos = [];
  public nombre: any;
  public entrada = {
    creadoFecha: "",
    creadoPor: "",
    dia: "",
    eliminado: false,
    dispositivoId: 0,
    empleadoId: "",
    entrada: "",
    entradaAlterada: false,
    salidaAlterada: false,
    fotoEntrada: this.tomafoto,
    fotosalida: this.tomafoto,
    horas: 0,
    foto64: "",
    manualEntrada: false,
    manualsalida: false,
    tipoMarca: "T",
    modificadoPor: "",
    modificadoFecha: "",
    precio: 0,
    total: 0  
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
    fotoEntrada: this.tomafoto,
    fotosalida: this.tomafoto,
    horas: 0,
    foto64: "",
    manualEntrada: false,
    manualsalida: false,
    tipoMarca: "T",
    modificadoPor: "",
    modificadoFecha: "",
    precio: 0,
    total: 0    
  };

  obtenerDispositivo() {
    this.storage.ready().then(() => {
      this.storage.get("cliente").then(data => {
        this.dispositivoId = data.dispositivoId;
        this.dispositivoNombre = data.dispositivo;
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

  obtenerRegistros() {
    this.storage.ready().then(() => {
      this.storage.get("registros").then(data => {
        this.entradas = data.entradas;
        this.salidas = data.salidas;
      })
    })
  }



  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public camara: Camera, public storage: Storage,
    public modalCtrl: ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, platform: Platform,) {
    this.obtenerDispositivo();
    this.obtenerEmpleados();
    this.obtenerEntradas();
    this.obtenerSalidas();
    this.obtenerRegistros();
    platform.registerBackButtonAction(fn => {
      this.navCtrl.push(HomePage);
    })
  }


  escanearQR(){
    // this.barcodeScanner.scan().then(barcodeData =>{
    //   this.escaneandoQr = barcodeData.text;
    //     this.verificar();
    // })
    console.log("1");
  }

  verificar(){
    let loader = this.loadingCtrl.create({
      content: "verificando datos ...",
    });
    loader.present();
    let verificar = 0;
    for (let item of this.empleados) {
      if (this.escaneandoQr == item.pin) {
        verificar = 1;
        this.nombre = item.nombre;
        this.empleadoId = item.empleadoId;
        this.tomafoto = item.capturarFoto;
      }
    }
    if (verificar == 1) {
      if (this.tomafoto == true) {
        this.getPicture();
      } else {
        this.guardarEntrada();
      }
    } else {
      let error = "Datos incorrectos"
      this.MostarToast(error);
    }
    setTimeout(() => {
      loader.dismiss();
    }, 3000);
  }

  guardarEntrada() {

    this.entrada.empleadoId = this.empleadoId;
    this.entrada.dia = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.entrada = moment().format("MM/DD/YYYY hh:mm A");
    this.entrada.fotoEntrada = this.tomafoto;
    this.entrada.creadoPor = this.dispositivoNombre
    this.entrada.creadoFecha = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.modificadoPor = this.dispositivoNombre
    this.entrada.modificadoFecha = moment().format("YYYY-MM-DD hh:mm");
    this.entrada.dispositivoId = this.dispositivoId;
    this.entrada.foto64 = this.foto;
    let entradaFinal = {
      empleadoId: this.empleadoId,
      estado: 'noEnviado',
      entrada: this.entrada
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
        this.salida.salida = moment().format("MM/DD/YYYY hh:mm A");
        this.salida.fotosalida = this.tomafoto;
        this.salida.creadoPor = this.dispositivoNombre;
        this.salida.modificadoPor = this.dispositivoNombre;
        this.salida.modificadoFecha = moment().format("YYYY-MM-DD hh:mm");
        this.salida.foto64 = this.foto;
        let salidaFinal = {
          empleadoId: this.empleadoId,
          salida: this.salida
        }

        let arreglo2 = [];
        if (this.datosSalida.length == 0) {
          arreglo2.push(salidaFinal);
          this.guardardatos = arreglo2;
          this.storage.set('salidas', this.guardardatos);
          this.estado = 'salida';
          this.salidas = this.salidas + 1;
          this.pantallaEstado = SalidaPage;
        } else {
          arreglo2 = this.datosSalida;
          arreglo2.push(salidaFinal);
          this.guardardatos = arreglo2;
          this.storage.set('salidas', this.guardardatos);
          this.estado = 'salida';
          this.salidas = this.salidas + 1;
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

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camara.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      quality: 100
    }
    this.camara.getPicture(options)
      .then(imageData => {
        this.foto = `data:image/png;base64,${imageData}`;
        this.guardarEntrada();
      })
      .catch(error => {
        console.error(error);
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

  presentModal(pantalla) {
    const modal = this.modalCtrl.create(pantalla, { empleado: this.nombre, estado: this.estado, hora: this.horacorta });
    modal.present();
  }
  
}
