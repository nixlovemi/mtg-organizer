import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { TbDeckService } from '../TbDeck/tb-deck.service';

@Component({
  selector: 'app-pg-deck-home-add',
  templateUrl: './pg-deck-home-add.page.html',
  styleUrls: ['./pg-deck-home-add.page.scss'],
})
export class PgDeckHomeAddPage implements OnInit {
  vDeckName   = '';
  vDeckFormat = '';

  constructor(
    public modalController: ModalController,
    private utils: UtilsService,
    public TbDeck: TbDeckService,
  ) { }

  ngOnInit() {}

  closeModal()
  {
    this.modalController.dismiss({});
  }

  async saveDeck()
  {
    if(this.vDeckName.trim() == ''){
      this.utils.showAlert('Warning', '', 'Please inform the deck name!', ['OK']);
      return;
    }
    if(this.vDeckFormat == ''){
      this.utils.showAlert('Warning', '', 'Please inform the deck format!', ['OK']);
      return;
    }

    var ret = await this.TbDeck.insertNewDeck(this.vDeckName, this.vDeckFormat);
    if(typeof ret["id"] != 'undefined'){
      this.modalController.dismiss({
        'deckId':ret["id"]
      });
    } else {
      this.utils.showAlert('Warning', '', ret, ['OK']);
      return;
    }
  }
}
