import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodigoQrPage } from './codigo-qr';

@NgModule({
  declarations: [
    CodigoQrPage,
  ],
  imports: [
    IonicPageModule.forChild(CodigoQrPage),
  ],
})
export class CodigoQrPageModule {}
