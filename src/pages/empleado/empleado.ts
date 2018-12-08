import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { Http } from '@angular/http';
import { ConexionProvider } from '../../providers/conexion/conexion';
import moment from 'moment';
import 'moment/locale/es';

@IonicPage()
@Component({
  selector: 'page-empleado',
  templateUrl: 'empleado.html',
})
export class EmpleadoPage {
  public id:any;
  public nombre: any;
  public foto: boolean;
  public empleado: any;
  public newFoto:any;
  public empleados = [];
  public posicion:any;
  public nombre_empresa:any;
  public dispositivo:any;

  obtenerDatos() {
    this.storage.ready().then(() => {
      this.storage.get("cliente").then(data => {
        this.nombre_empresa = data.nombre;
        this.dispositivo = data.dispositivo
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public conexion: ConexionProvider, public alertCtrl: AlertController) {
    this.obtenerEmpleados();
    this.id = this.navParams.get('empleadoId');
    this.nombre = this.navParams.get('nombre');
    this.foto = this.navParams.get('foto');
    this.posicion = this.navParams.get('posicion');
    this.empleado = this.nombre
  }


   updateCucumber() {
     this.storage.ready().then(() => {
       this.storage.get("empleados").then(data => {
         data[this.posicion]['capturarFoto'] = this.foto;
         this.storage.set("empleados", data);
         let direccion = this.conexion.Url + "empleado/foto/" + this.id;  
        let modificarEMP = {
          capturarFoto:this.foto,
          modificadoPor: this.dispositivo,
          modificadoFecha: moment().format("YYYY-MM-DD hh:mm")
        }
         this.http.patch(direccion, modificarEMP)
           .subscribe(respuesta => {
             let valor = respuesta.json;
           })
         this.presentAlert();
       })
     })
    }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Actualizacion exitosa\n',
      buttons: [
        {
          text: 'Continuar',
          role: 'Continuar',
          handler: () => {
            this.navCtrl.push(ConfiguracionPage);
          }
        }
      ]
    });
    alert.present();
  }

}
