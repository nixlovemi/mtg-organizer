import { Component, OnInit } from '@angular/core';
import { TbDeckService } from '../TbDeck/tb-deck.service';
import { ActivatedRoute } from  "@angular/router";
import { ActionSheetController, NavController, Events } from '@ionic/angular';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-pg-deck-home-detail',
  templateUrl: './pg-deck-home-detail.page.html',
  styleUrls: ['./pg-deck-home-detail.page.scss'],
})
export class PgDeckHomeDetailPage implements OnInit {
  deckTitle = '';
  deckId    = 0;
  vDeck     = [];

  constructor(
    public TbDeck: TbDeckService,
    private actRoute: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public utils: UtilsService,
    private navCtrl: NavController,
    private events: Events,
  ) {}

  async ngOnInit()
  {
    await this.actRoute.params.subscribe((res) => {
      if(typeof res.deck_id != 'undefined'){
        this.deckId = res.deck_id; //vem undefined qdo n tem param | tento deixar 0 default | pode vir texto
      } else {
        this.deckId = 0;
      }
    });
  }

  async ionViewWillEnter()
  {
    var retDeck    = await this.TbDeck.getDeckById(this.deckId);
    this.vDeck     = retDeck;
    this.deckTitle = retDeck["title"];
  }

  async showSheetOptions()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteDeck();
        }
      }/*, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }*/, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

  async deleteDeck()
  {
    this.utils.showAlert('Delete deck ' + this.deckTitle, '', 'Do you really want to delete this deck?', [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => { }
      }, {
        text: 'Yes!',
        handler: () => {
          this.postDeleteDeck();
        }
      }
    ]);
  }

  async postDeleteDeck()
  {
    await this.utils.getLoader('Please wait', 'dots', false);
    var msg = await this.TbDeck.deleteDeck(this.deckId);
    await this.utils.closeLoader();

    await this.utils.showAlert('Return', '', msg, ['OK']);
    await this.events.publish('reloadMyDecks');
    await this.navCtrl.back();
  }
}
