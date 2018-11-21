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
  public companiaid:any;
  public datosEntradas = [];
  public datosSalida = [];
  public datosEmpleados = [];

  obtenerDatos(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.nombre_empresa = data.nombre;
        this.companiaid = data.companiaId
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
  
  obtenerEntradas() {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("entradas").then(data => {
        this.datosEntradas = data;
        this.sincronizarEntrada();
      })
    })
  }

  obtenerSalidas() {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("salidas").then(data => {
        this.datosSalida = data;
        this.sincronizarSalida();
      })
    })
  }

  configuracion(){
  this.navCtrl.push(AdministradorPage);
  }
  
horaActual(){
  this.hora = moment().format('hh:mm ss a');    
  if (this.hora == '06:14 25 pm'){
   this.empleados();
     }
}


  empleados() {
    let direccion = this.conexion.Url + "empleados";
    this.http.get(direccion)
      .map(resp => resp.json())
      .subscribe(data => {
        for (let item of data) {
          if (item.companiaId == 2) {
            this.datosEmpleados.push(item);
          }
        }
        this.storageCrtl.set('empleados', this.datosEmpleados);
      })
  }

  sincronizarEntrada() {
    this.TipoConexion = this.networkCtrl.type;
    if (this.TipoConexion != 'null') {
      if (this.datosEntradas.length > 0) {
        let cont = 0;
        for(let item of this.datosEntradas) {
          console.log(cont);
           let verificar = this.conexion.Url + "tiempo/empleado/" + item.empleadoId;
           this.http.get(verificar)
            .map(res => res.json())
            .subscribe(respuesta => {
             if(!respuesta && item.estado == 'noEnviado'){
               let direccion = this.conexion.Url + "tiempo/empleado/";
               this.http.post(direccion, item.entrada)
              .subscribe(respuesta => {       
               })
            }
           })
          this.actualizarRegistros(cont);  
          cont++
        }
      } 
    }
  }

  sincronizarSalida() {
    this.TipoConexion = this.networkCtrl.type;
    if (this.TipoConexion != 'null') {
      if (this.datosSalida.length > 0) {
        for (let items2 of this.datosSalida) {
          let direccion2 = this.conexion.Url + "tiempo/empleado/" + items2.empleadoId;
          this.http.patch(direccion2, items2.salida)
            .subscribe(respuesta => {
              let valor = respuesta.json;
            })
        }
      }
    }
  }


  actualizarRegistros(numero){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("entradas").then(data => {
      data[numero]['estado'] = 'enviado';
      this.storageCrtl.set("entradas", data)
      })
    })
  }

}
