import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { VerificacionPage } from '../pages/verificacion/verificacion';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;
  public keys:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public alertCtrl: AlertController) {
    platform.ready().then(() => {
    this.storage.ready().then(()=>{
      this.storage.keys().then(data =>{
      this.keys = data;
        if(this.keys.includes('cliente')){
          this.rootPage = HomePage;
        }else{
          this.rootPage = VerificacionPage;
        }

      })
    })
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
  }

  
}

