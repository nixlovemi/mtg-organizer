import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  arrCards     = [];
  arrCardsName = [];

  constructor() { }

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
}
