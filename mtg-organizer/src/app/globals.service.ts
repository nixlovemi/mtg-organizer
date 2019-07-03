import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  arrCards     = [];
  arrCardsName = [];
  isApp        = false;

  constructor(
    private file: File,
  ) { }

  setArrCards(arrCards){
    this.arrCards = arrCards;
  }

  getArrCards(){
    return this.arrCards;
  }

  setArrCardsName(arrCardsName){
    this.arrCardsName = arrCardsName;
  }

  getArrCardsName(){
    return this.arrCardsName;
  }

  setIsApp(isApp){
    this.isApp = isApp;
  }

  getIsApp(){
    return this.isApp;
  }

  getSavePath(){
    return this.file.dataDirectory;
  }
}
