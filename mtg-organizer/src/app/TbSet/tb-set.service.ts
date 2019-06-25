import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class TbSetService {

  constructor(
    public storage: Storage,
    public http: Http,
  ) { }

  getJsonTbSet(){
    return new Promise(
    (resolve, reject) => {
      this.http.get("../../assets/data/sets.json")
      .subscribe((data) => {
        let jsonRet;
        jsonRet = JSON.parse(data["_body"]);
        resolve(jsonRet);
      },
      (error) => {
        var TbSet = [];
        reject(JSON.stringify(TbSet));
      });
    });
  }
}
