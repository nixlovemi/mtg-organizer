import { Injectable } from '@angular/core';
import { UtilsService } from '../utils.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TbDeckService {

  constructor(
    private storage: Storage
  ) { }

  requestSerialUID()
  {
    return new Promise(
    (resolve, reject) => {
      this.storage.get('serial_deck_id').then((vSerialId) => {
        var uid = vSerialId;
        if(vSerialId == null){
          uid = 0;
        }

        uid++;
        this.storage.set('serial_deck_id', uid);

        resolve(uid);
      })
      .catch((err) => {
        resolve(null);
      });
    });
  }

  initEmptyTbDeck()
  {
    this.storage.set('tb_deck', '{}');
  }

  initEmptyTbDeckCards()
  {
    this.storage.set('tb_deck_card', '{}');
  }

  getDeckData()
  {
    return new Promise(
    (resolve, reject) => {
      this.storage.get('tb_deck').then((val) => {
        resolve(val);
      })
      .catch((err) => {
        resolve(null);
      });
    });
  }

  getDeckCardData()
  {
    return new Promise(
    (resolve, reject) => {
      this.storage.get('tb_deck_card').then((val) => {
        resolve(val);
      })
      .catch((err) => {
        resolve(null);
      });
    });
  }

  async getDeckById(id)
  {
    var retDeck  = {};
    var Decks    = await this.getDeckData();
    var arrDecks = JSON.parse(Decks + '');
    if(arrDecks != null){
      for(let idx in arrDecks){
        var loopDeck = arrDecks[idx];
        if(loopDeck.id == id){
          retDeck = loopDeck;
          break;
        }
      }
    }

    return retDeck;
  }

  deckObjectToArray(deckObject)
  {
    if(deckObject == null){
      deckObject = '{}';
    }

    var objDecks = JSON.parse(deckObject);
    var arrDecks = [];

    Object.keys(objDecks).forEach(function(key) {
      arrDecks.push(objDecks[key]);
    });

    return arrDecks;
  }

  insertNewDeck(name, format)
  {
    return new Promise(
    (resolve, reject) => {
      this.requestSerialUID().then((deckId) => {
        var Deck = {
          "id":deckId,
          "format":format,
          "title":name,
          "white_sym":false,
          "blue_sym":false,
          "black_sym":false,
          "red_sym":false,
          "green_sym":false,
          "colorless_sym":false,
          "cmc":0,
          "main":0,
          "side":0,
        };

        this.getDeckData().then((deckData) => {
          var arrDecks = this.deckObjectToArray(deckData);
          arrDecks.push(Deck);
          var jsonSave = JSON.stringify(arrDecks);
          this.storage.set('tb_deck', jsonSave);
          resolve(Deck);
        });
      })
      .catch((err) => {
        reject('Error while saving new deck!');
      });
    });
  }

  deleteDeck(deckId)
  {
    return new Promise(
    (resolve, reject) => {
      this.getDeckData().then((deckData) => {
        // deck
        var arrDecks    = this.deckObjectToArray(deckData);
        var newArrDecks = [];

        for(let idx in arrDecks){
          var Deck = arrDecks[idx];
          if(Deck["id"] != deckId){
            newArrDecks.push( Deck );
          }
        }
        var jsonSave = JSON.stringify(newArrDecks);
        this.storage.set('tb_deck', jsonSave);
        // ====

        // cards
        this.getDeckCardData().then((deckCardData) => {
          var arrDeckCard     = this.deckObjectToArray(deckCardData);
          var newArrDecksCard = [];

          for(let idx2 in arrDeckCard){
            var DeckCard = arrDeckCard[idx2];
            if(DeckCard["deckId"] != deckId){
              newArrDecksCard.push(DeckCard);
            }
          }

          var jsonSave2 = JSON.stringify(newArrDecksCard);
          this.storage.set('tb_deck_card', jsonSave2);

          resolve('Deck deleted successfully!')
        });
        // =====
      })
      .catch((err) => {
        reject('Error while deleting deck!' + err);
      });
    });
  }
}
