import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import moment from 'moment';
import 'moment/locale/es';
import { AdministradorPage } from '../administrador/administrador';
import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network';
import { ConexionProvider } from '../../providers/conexion/conexion';
import { Http } from '@angular/http';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public nombre_empresa:any 
  public fecha:any;
  public hora: any;
  public entradas:any;
  public salidas:any;
  public TipoConexion: any;
  public datosEntradas:any;
  public datosSalida:any;

  obtenerDatos(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.nombre_empresa = data.nombre;
      })
    })   
  }
  obtenerRegistros(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("registros").then(data => {
        this.entradas = data.entradas;
        this.salidas = data.salidas;
      })
    })   
  }
  obtenerEntradas() {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("entradas").then(data => {
        this.datosEntradas = data;
      })
    })
  }
  obtenerSalidas() {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("salidas").then(data => {
        this.datosSalida = data;
      })
    })
  }


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storageCrtl: Storage, private networkCtrl: Network,
    public conexion: ConexionProvider, public http: Http) {
    this.obtenerDatos();
    this.obtenerRegistros();
    this.obtenerEntradas();
    this.obtenerSalidas();
    this.fecha = moment().format('LL');
    Observable.interval(1000).subscribe(() => {
      this.horaActual();
    });

  }
  configuracion(){
  this.navCtrl.push(AdministradorPage);
  }
  
horaActual(){
  this.hora = moment().format('hh:mm ss a');
}

sincronizarDatos(){
 this.TipoConexion = this.networkCtrl.type;
  if(this.TipoConexion != 'null'){
    let direccion = this.conexion.Url + "tiempo/empleado/";
    for(let items of this.datosEntradas){
      this.http.post(direccion, items)
        .subscribe(respuesta => {
          let valor = respuesta.json;
          console.log(valor);
        })
    }  
    
    for (let items2 of this.datosSalida) {
      let direccion2 = this.conexion.Url + "tiempo/empleado/" + items2.empleadoId;
      this.http.patch(direccion2, items2.salida)
        .subscribe(respuesta => {
          let valor = respuesta.json;
          console.log(valor);
        })
    }  


  }
}


}
