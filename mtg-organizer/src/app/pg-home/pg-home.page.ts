import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';
import { TbSetService } from '../TbSet/tb-set.service';

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
  ) { }

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

    // test sets
    this.getAllSets().then((arrSet:any) => {
      this.vSets = arrSet;
    });
    // =========
  }

  getAllSets(){
    return new Promise(
    (resolve, reject) => {
      let arraySets = [];

      this.storage.get('tb_set').then((arrSet) => {
        function date_sort(a, b) {
          return new Date(b.set_released_at).getTime() - new Date(a.set_released_at).getTime();
        }
        arrSet.sort(date_sort);

        for(var i=0; i<arrSet.length; i++){
          var Set = arrSet[i];

          if(Set.set_card_count > 0){
            var vSetName = Set.set_name;

            var set = {
              "id"         : Set.set_id,
              "name"       : vSetName,
              "code"       : Set.set_code,
              "card_count" : Set.set_card_count,
              "url_icon"   : "./assets/set_images/" + Set.set_id + "-" + Set.set_code + ".svg"
            };
            arraySets.push(set);
            if(i == 4){
              break;
            }
          }
        }
        if(arrSet.length > 5){
          this.vShowMoreSets = true;
        }
        resolve(arraySets);
      })
      .catch((arrSet) => {
        resolve(arraySets);
      });
    });
  }

  viewDeck(deckId){
    console.log(deckId);
  }

  updateSets(){
    this.TbSet.getJsonTbSet().then((jsonTbSet) => {
      this.storage.set('tb_set', jsonTbSet);

      this.getAllSets().then((arrSet:any) => {
        this.vSets = arrSet;
      });
    });
  }
}
