import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';
import { TbSetService } from '../TbSet/tb-set.service';
import { TbDeckService } from '../TbDeck/tb-deck.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pg-home',
  templateUrl: './pg-home.page.html',
  styleUrls: ['./pg-home.page.scss'],
})
export class PgHomePage implements OnInit {

  vDecks        = [];
  vSets         = [];
  vShowMoreSets = false;

  constructor(
    public http: Http,
    public storage: Storage,
    public utils: UtilsService,
    public TbSet: TbSetService,
    public TbDeck: TbDeckService,
    private router: Router,
  ) { }

  ngOnInit()
  {
    this.loadHomePage();
  }

  ionViewDidEnter(){ }

  async loadHomePage()
  {
    this.vDecks      = [];
    var jsonDecks    = await this.TbDeck.getDeckData();
    var arrDecks:any = JSON.parse(jsonDecks + '');
    if(arrDecks != null){
      for(let idx in arrDecks){
        var Deck = arrDecks[idx];
        this.vDecks.push(Deck);
      }
    }

    /*var deck1 = {
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
    this.vDecks.push(deck2);*/

    // test sets
    var arrSet:any = await this.TbSet.getAllSets();
    this.vSets     = arrSet.arraySets;
    if(arrSet.count > 5){
      this.vShowMoreSets = true;
    }
    // =========
  }

  viewDeck(deckId)
  {
    console.log(deckId);
  }

  detailSet(setId)
  {
    let navigationExtras: NavigationExtras = {
      state: {
        setId: setId
      }
    };
    this.router.navigate(['set-details'], navigationExtras);
  }

  async refreshHome(event)
  {
    await this.utils.getLoader('Loading, please wait', 'dots');
    await this.loadHomePage();
    await this.utils.closeLoader();
    event.target.complete();
  }
}
