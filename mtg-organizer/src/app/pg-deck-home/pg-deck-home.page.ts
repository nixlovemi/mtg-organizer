import { Component, OnInit } from '@angular/core';
import { TbDeckService } from '../TbDeck/tb-deck.service';
import { PgDeckHomeAddPage } from '../pg-deck-home-add/pg-deck-home-add.page';
import { ModalController, Events } from '@ionic/angular';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-pg-deck-home',
  templateUrl: './pg-deck-home.page.html',
  styleUrls: ['./pg-deck-home.page.scss'],
})
export class PgDeckHomePage implements OnInit {
  vDecks = [];

  constructor(
    public TbDeck: TbDeckService,
    public modalController: ModalController,
    private router: Router,
    private events: Events,
  ) { }

  async ngOnInit()
  {
    this.events.subscribe('reloadMyDecks', () => {
      this.loadDecks();
    });
    this.events.subscribe('deckHomeOpenDeck', (deckId) => {
      console.log(deckId);
      this.router.navigate(['/pg-deck-home-detail/' + deckId], {});
    });
    await this.loadDecks();
  }

  async loadDecks()
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
  }

  async addNewDeck()
  {
    const modal = await this.modalController.create({
      component: PgDeckHomeAddPage,
      componentProps: { }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data.deckId > 0){
      await this.loadDecks();
      this.router.navigate(['/pg-deck-home-detail/' + data.deckId]);
    }
  }
}
