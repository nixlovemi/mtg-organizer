import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  arrSet          = [];
  arrCards        = [];
  arrCardsName    = [];
  arrGlobSetCards = [];
  isApp           = false;

  constructor(
    private file: File,
  ) { }

  setArrSet(arrSet){
    this.arrSet = arrSet;
  }

  getArrSet(){
    return this.arrSet;
  }

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

  setGlobSetCards(vGlobSetCards){
    this.arrGlobSetCards = vGlobSetCards;
  }

  getGlobSetCards(){
    return this.arrGlobSetCards;
  }
}
