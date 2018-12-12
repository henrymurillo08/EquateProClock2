import { Component } from '@angular/core';
import { NavController, ModalController, Platform, AlertController } from 'ionic-angular';
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
  public clienteId: any;
  public datosEntradas = [];
  public datosSalida = [];
  public datosEmpleados = [];

  obtenerDatos(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.nombre_empresa = data.dispositivo;
        this.companiaid = data.companiaId
        this.clienteId = data.clienteId
      })
    })   
  }

  obtenerRegistros(){
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("registros").then(data => {
        if (data.salidas == data.entradas && data.salidas > 0 && data.entradas > 0) {
          let registros = {
            entradas: 0,
            salidas: 0
          }
          this.entradas = 0;
          this.salidas = 0;
          this.storageCrtl.set("registros", registros)
        }else{
          this.entradas = data.entradas;
          this.salidas = data.salidas;
        }        
      })
    })   
  }

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storageCrtl: Storage, private networkCtrl: Network, platform: Platform, public alertCtrl: AlertController,
    public conexion: ConexionProvider, public http: Http) {
    this.obtenerDatos();
    this.obtenerRegistros();
    this.obtenerEntradas();
    this.obtenerSalidas();
    this.fecha = moment().format('LL');
    Observable.interval(1000).subscribe(() => {
      this.horaActual();
    });
    platform.registerBackButtonAction(fn => {
      let alert = this.alertCtrl.create({
        title: 'Salir de EquateClock',
        subTitle: 'Desea salir de EquateClock',
        buttons: [
          {
            text: 'Continuar',
            role: 'Continuar',
            handler: () => {
              platform.exitApp();
            }
          },
          {
            text: 'Cancelar',
          }
        ]
      });
      alert.present();
    })
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
  if (this.hora == '05:07 00 pm'){
   this.empleados();
     }
}


  empleados() {
    let direccion = this.conexion.Url + "empleados/compania/" + this.companiaid + "/sucursal/" + this.clienteId;
    this.http.get(direccion)
      .map(resp => resp.json())
      .subscribe(data => {
        this.storageCrtl.set('empleados', data);
      })
  }



  sincronizarEntrada() {
    this.TipoConexion = this.networkCtrl.type;
    if (this.TipoConexion != 'null') {
      if (this.datosEntradas.length > 0) {
        let cont = 0;
        for(let item of this.datosEntradas) {
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
          this.eliminarEntradas(items2.empleadoId); 
          this.eliminarSalidas(items2.empleadoId); 
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

  eliminarEntradas(empleadoId){
    this.storageCrtl.ready().then(() => {
    this.storageCrtl.get("entradas").then(data => {   
      let nuevosEntradas = [];
        for(let items of data){
          if(items.empleadoId != empleadoId){
            nuevosEntradas.push(items)
          }
        }
      this.storageCrtl.set("entradas", nuevosEntradas)
      })
    })
  }

  eliminarSalidas(empleadoId) {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("salidas").then(data => {
        let nuevaSalidas = [];
        for (let items of data) {
          if (items.empleadoId != empleadoId) {
            nuevaSalidas.push(items)
          }
        }
        this.storageCrtl.set("salidas", nuevaSalidas)
      })
    })
  }

}
