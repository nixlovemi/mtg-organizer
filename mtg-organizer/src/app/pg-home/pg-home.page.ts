import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pg-home',
  templateUrl: './pg-home.page.html',
  styleUrls: ['./pg-home.page.scss'],
})
export class PgHomePage implements OnInit {

  vDecks = [];

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    var deck1 = {
      "id":1,
      "format":"standard",
      "title":"Mono Red Aggro",
      "white_sym":false,
      "blue_sym":false,
      "black_sym":false,
      "red_sym":true,
      "green_sym":false,
      "colorless_sym":false,
      "cmc":2.8,
      "main":60,
      "side":15,
    };
    this.vDecks.push(deck1);

    var deck2 = {
      "id":2,
      "format":"modern",
      "title":"5C Dragons",
      "white_sym":true,
      "blue_sym":true,
      "black_sym":true,
      "red_sym":true,
      "green_sym":true,
      "colorless_sym":false,
      "cmc":4.8,
      "main":60,
      "side":14,
    };
    this.vDecks.push(deck2);
  }

  viewDeck(deckId){
    console.log(deckId);
  }
}
