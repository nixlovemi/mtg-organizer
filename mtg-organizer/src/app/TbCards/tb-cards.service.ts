import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalsService } from '../globals.service';
import { TbSetService } from '../TbSet/tb-set.service';

@Injectable({
  providedIn: 'root'
})
export class TbCardsService {
  constructor(
    public storage: Storage,
    private globalServ: GlobalsService,
    public SetSrv: TbSetService,
  ) { }

  getCard(cardId){
    return new Promise(
    (resolve, reject) => {
      var arrCardsName = this.globalServ.getArrCardsName();
      var arrCards     = this.globalServ.getArrCards();

      var Card = arrCards[cardId];
      if(typeof Card == "undefined"){
        reject("Card Id does not exists!");
      } else {
        Card.card_name = arrCardsName[Card.car_cdn_id];
        resolve(Card);
      }
    });
  }

  getCardsBySet(setId){
    return new Promise(
    (resolve, reject) => {
      let arrayRet       = [];

      fetch('../../assets/data/set_cards.json').then(res => res.json()).then(jsonSetCards => {
        var arrSetCards = jsonSetCards[setId];
        for(var i=0; i<arrSetCards.length; i++){
          var vCarId   = arrSetCards[i];
          this.getCard(vCarId).then(Card => {
            arrayRet.push(Card);
          });
        }

        resolve(arrayRet);
      }).catch((arrSet) => {
        resolve(arrayRet);
      });
    });
  }

  // getCardsBySet
  getHtmlCardId(cardId, size=''){
    return new Promise(
    (resolve, reject) => {
      this.getCard(cardId).then((Card:any) => {
        var vPtText = '';
        if(Card.card_name.car_loyalty != null){
          vPtText = Card.card_name.car_loyalty;
        } else if(Card.card_name.car_power != null && Card.card_name.car_toughness != null){
          vPtText = Card.card_name.car_power + '/' + Card.card_name.car_toughness;
        }

        var vOracleTxt = '';
        if(Card.car_oracle_text != null){
          vOracleTxt = Card.car_oracle_text;
        } else {
          vOracleTxt        = '';
          var jsonCardFaces = JSON.parse(Card.card_name.car_card_faces);

          for(var iii=0; iii<jsonCardFaces.length; iii++){
            var CardFace   = jsonCardFaces[iii];
            var isCreature = CardFace.type_line.indexOf('Creature') >= 0;

            if(isCreature){
              vOracleTxt += 'Creature - ' + CardFace.oracle_text + ' ('+CardFace.power+'/'+CardFace.toughness+') // ';
            } else {
              vOracleTxt += CardFace.oracle_text + ' // ';
            }
          }

          vOracleTxt = vOracleTxt.substr(0, vOracleTxt.length - 4);
        }

        this.SetSrv.getSetByTxt( Card.car_set ).then((Set:any) => {
          // @todo melhorar HTML e fazer carta split
          var card = {
            "name"       : Card.car_name,
            "htmlCost"   : this.getImageFromCardSymbol(Card.card_name.car_mana_cost),
            "type"       : Card.card_name.car_type_line,
            "text"       : vOracleTxt,
            "pt_text"    : vPtText,
            "number"     : Card.car_collector_number,
            "total"      : Set.set_card_count,
            "img_path"   : "../../assets/card_images/" + Card.cim_url_app,
            "colorClass" : this.getCardColorClass(Card.card_name.car_colors),
            "show_power" : ((Card.card_name.car_power != null && Card.card_name.car_toughness != null) || Card.card_name.car_loyalty != null),
          };

          if(size == 'large'){
            var cssCard = 'card-large';
            var cssDesc = 'card-desc-large';
          } else {
            var cssCard = '';
            var cssDesc = '';
          }

          var htmlCard =        '<div class="card '+cssCard+'">';
          htmlCard = htmlCard + '  <div class="inner '+card.colorClass+'">';
          htmlCard = htmlCard + '    <div class="title">';
          htmlCard = htmlCard + '      <div class="cost">'+card.htmlCost+'</div>';
          htmlCard = htmlCard + '      '+card.name+'';
          htmlCard = htmlCard + '    </div>';
          htmlCard = htmlCard + '    <div class="image">&nbsp;</div>';
          htmlCard = htmlCard + '    <div class="type">';
          htmlCard = htmlCard + '      '+card.type+'';
          htmlCard = htmlCard + '      <div class="symbol">';
          htmlCard = htmlCard + '        <i class="ss ss-emn ss-uncommon ss-fw"></i>';
          htmlCard = htmlCard + '      </div>';
          htmlCard = htmlCard + '    </div>';
          htmlCard = htmlCard + '    <div class="desc '+cssDesc+'">';
          htmlCard = htmlCard + '      '+card.text+'';
          htmlCard = htmlCard + '    </div>';
          if(card.show_power == true){
            htmlCard = htmlCard + '  <div class="power">';
            htmlCard = htmlCard + '    <span>'+card.pt_text+'</span>';
            htmlCard = htmlCard + '  </div>';
          }
          htmlCard = htmlCard + '    <div class="footer">';
          htmlCard = htmlCard + '      '+card.number+'/'+card.total+'';
          htmlCard = htmlCard + '    </div>';
          htmlCard = htmlCard + '  </div>';
          htmlCard = htmlCard + '</div>';

          resolve(htmlCard);
        });
      })
      .catch((err) => {
        reject('');
      });
    });
  }

  getImageFromCardSymbol(cardSymbol){
    var htmlRet      = '';
    var arrSplitCard = cardSymbol.split('//');
    for(var i=0; i<arrSplitCard.length; i++){
      var vCardS = arrSplitCard[i].trim();

      var arrSym  = vCardS.split("}");
      for(var ii=0; ii<arrSym.length; ii++){
        var txtSym = arrSym[ii];
        if(txtSym != ""){
          txtSym  = txtSym.replace('{', '');
          htmlRet = htmlRet + '<abbr class="card-symbol card-symbol-'+txtSym+'"></abbr>';
        }
      }

      htmlRet += '//';
    }

    return htmlRet.substr(0, htmlRet.length - 2);
  }

  getCardColorClass(strCardColors){
    var retClass       = 'card-color-colorless';
    var jsonCardColors = JSON.parse(strCardColors);

    if(jsonCardColors.length > 1){
      retClass = 'card-color-multicolor';
    } else if(jsonCardColors.length == 1){
      var color = jsonCardColors[0];

      if(color == 'B'){
        retClass = 'card-color-black';
      } else if(color == 'G'){
        retClass = 'card-color-green';
      } else if(color == 'R'){
        retClass = 'card-color-red';
      } else if(color == 'U'){
        retClass = 'card-color-blue';
      } else if(color == 'W'){
        retClass = 'card-color-white';
      }
    }

    return retClass;
  }
}
