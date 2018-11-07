import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController, Ion } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

//Providers
import { ConexionProvider } from '../providers/conexion/conexion';

//Plugins
import { HttpModule } from '@angular/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Device } from '@ionic-native/device';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';

//Paginas
import { AdministradorPage } from '../pages/administrador/administrador';
import { CodigoQrPage } from '../pages/codigo-qr/codigo-qr';
import { TabsPage } from '../pages/tabs/tabs';
import { PinPage } from '../pages/pin/pin';
import { VerificacionPage } from '../pages/verificacion/verificacion';
import { HomePage } from '../pages/home/home';
import { ConfiguracionPage } from "../pages/configuracion/configuracion";
import { EntradaPage } from '../pages/entrada/entrada';
import { SalidaPage } from '../pages/salida/salida';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    VerificacionPage,
    PinPage,
    TabsPage,
    CodigoQrPage,
    AdministradorPage,
    ConfiguracionPage,
    EntradaPage,
    SalidaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
    HttpModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    VerificacionPage, 
    PinPage,
    TabsPage,
    CodigoQrPage,
    AdministradorPage,
    ConfiguracionPage,
    EntradaPage,
    SalidaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera, 
    AlertController, 
    Geolocation,
    Device,
    BarcodeScanner,
    ConexionProvider,
    Network
   
  ]
})
export class AppModule {}
