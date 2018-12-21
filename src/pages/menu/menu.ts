import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController   } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { VerificacionPage } from '../verificacion/verificacion';
import { ConexionProvider } from '../../providers/conexion/conexion';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public entradas: any;
  public salidas: any;
  public TipoConexion: any;
  public companiaid: any;
  public clienteId: any;
  public datosEntradas = [];
  public datosSalida = [];
  public datosEmpleados = [];

  obtenerDatos() {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("cliente").then(data => {
        this.companiaid = data.companiaId
        this.clienteId = data.clienteId
      })
    })
  }

  obtenerRegistros() {
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
        } else {
          this.entradas = data.entradas;
          this.salidas = data.salidas;
        }
      })
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageCrtl: Storage, public alertCtrl: AlertController,
    public conexion: ConexionProvider, public http: Http, private networkCtrl: Network, public loadingCtrl: LoadingController) {
       this.obtenerDatos();
       this.obtenerRegistros();
  }

 
  remover(){
      const confirm = this.alertCtrl.create({
        title: 'Desea eliminar todos los registro?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.storageCrtl.clear();
              this.navCtrl.push(VerificacionPage);
            }
          }
        ]
      });
      confirm.present();
    }

    sincronizar(){
        const loader = this.loadingCtrl.create({
          content: "Sincronizando",
          duration: 3000
        });
      this.empleados();
      this.cliente();
      this.obtenerEntradas();
      this.obtenerSalidas();
      loader.present();
    }

  empleados() {
    let direccion = this.conexion.Url + "empleados/compania/" + this.companiaid + "/sucursal/" + this.clienteId;
    this.http.get(direccion)
      .map(resp => resp.json())
      .subscribe(data => {
        this.storageCrtl.set('empleados', data);
      })
  }

  cliente() {
    let direccion = this.conexion.Url + "clientes/" + this.clienteId;
    this.http.get(direccion)
      .map(resp => resp.json())
      .subscribe(data => {
        this.storageCrtl.set('sucursal', data);
      })
  }

  sincronizarEntrada() {
    this.TipoConexion = this.networkCtrl.type;
    if (this.TipoConexion != 'null') {
      if (this.datosEntradas.length > 0) {
        let cont = 0;
        for (let item of this.datosEntradas) {
          let verificar = this.conexion.Url + "tiempo/empleado/" + item.empleadoId;
          this.http.get(verificar)
            .map(res => res.json())
            .subscribe(respuesta => {
              if (!respuesta && item.estado == 'noEnviado') {
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

  actualizarRegistros(numero) {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("entradas").then(data => {
        data[numero]['estado'] = 'enviado';
        this.storageCrtl.set("entradas", data)
      })
    })
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

  eliminarEntradas(empleadoId) {
    this.storageCrtl.ready().then(() => {
      this.storageCrtl.get("entradas").then(data => {
        let nuevosEntradas = [];
        for (let items of data) {
          if (items.empleadoId != empleadoId) {
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

  irEmpleados(){
    this.navCtrl.push(ConfiguracionPage);
  }

  salir(){
    this.navCtrl.push(HomePage);
  }

}
