
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConexionProvider {

  public Url: any;
  
  constructor(public http:Http) {
    this.Url = "https://equatetime.azurewebsites.net/api/";
  }

}
