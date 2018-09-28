import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage'

import { HomePage } from '../pages/home/home';
import { PinPage } from '../pages/pin/pin';
import { VerificacionPage } from '../pages/verificacion/verificacion';
import { TabsPage } from '../pages/tabs/tabs';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;
  public keys:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage:Storage) {
    platform.ready().then(() => {
    this.storage.ready().then(()=>{
      this.storage.keys().then(data =>{
      this.keys = data;
        if(this.keys.includes('Dispositivo')){
          this.rootPage = TabsPage;
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

