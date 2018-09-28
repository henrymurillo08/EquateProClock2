import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController, Ion } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VerificacionPage } from '../pages/verificacion/verificacion';
import { PinPage } from '../pages/pin/pin';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { TabsPage } from '../pages/tabs/tabs';
import { CodigoQrPage } from '../pages/codigo-qr/codigo-qr';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2'


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    VerificacionPage,
    PinPage,
    TabsPage,
    CodigoQrPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgxQRCodeModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    VerificacionPage, 
    PinPage,
    TabsPage,
    CodigoQrPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera, 
    AlertController, 
    Geolocation,
    Device,
    BarcodeScanner
   
  ]
})
export class AppModule {}
