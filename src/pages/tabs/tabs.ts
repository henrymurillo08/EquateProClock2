import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { PinPage } from '../pin/pin';
import { CodigoQrPage } from '../codigo-qr/codigo-qr';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  conta = 0;
  tab1Root = HomePage;
  tab2Root = PinPage;
  tab3Root = CodigoQrPage;

  constructor() {
  }

}
