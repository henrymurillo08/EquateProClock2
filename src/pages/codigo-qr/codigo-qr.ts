import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

@IonicPage()
@Component({
  selector: 'page-codigo-qr',
  templateUrl: 'codigo-qr.html',
})
export class CodigoQrPage {

  dataqr = null;
  creandoQr = null;
  escaneandoQr = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner:BarcodeScanner) {
  }

  crearQR(){
    this.creandoQr = this.dataqr
  }

  escaneraQR(){
    this.barcodeScanner.scan().then(barcodeData =>{
      this.escaneandoQr = barcodeData.text;
    })
  }


}
