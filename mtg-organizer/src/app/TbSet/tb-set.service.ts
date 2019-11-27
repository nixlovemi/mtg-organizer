import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { GlobalsService } from '../globals.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TbSetService {
  arrSets = [];

  constructor(
    public storage: Storage,
    public http: Http,
    public GlobSrv: GlobalsService
  ) { }

  getAllSets(limit=5, filter=''){
    return new Promise(
    (resolve, reject) => {
      let arrayRet  = {
        "arraySets" : [],
        "count"     : 0,
      };
      let arraySets  = [];
      let globArrSet = this.GlobSrv.getArrSet();

      for(let idx in globArrSet){
        var Set = globArrSet[idx];
        if(Set.set_card_count > 0){
          var vSetName = Set.set_name;
          var vFiltered = true;

          if(filter != ''){
            vFiltered = vSetName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          }

          if(vFiltered){
            var set = {
              "id"         : Set.set_id,
              "name"       : vSetName,
              "code"       : Set.set_code,
              "card_count" : Set.set_card_count,
              "release_dt" : Set.set_released_at,
              "url_icon"   : "./assets/set_images/" + Set.set_id + "-" + Set.set_code + ".svg"
            };
            arraySets.push(set);
            if(arraySets.length == (limit)){
              break;
            }
          }
        }
      }

      arrayRet.arraySets = arraySets;
      arrayRet.count     = globArrSet.length;
      resolve(arrayRet);
    });
  }

  getSet(setId){
    return new Promise(
    (resolve, reject) => {
      fetch('../../assets/data/sets.json').then(res => res.json())
      .then(jsonSet => {
        var Set = jsonSet[setId];
        if(typeof Set == 'undefined'){
          reject("Set ID does not exists!");
        } else {
          resolve(Set);
        }
      })
      .catch((err) => {
        reject('Error fetching Set! Message:' + err);
      });
    });
  }

  /* ex: gn2 */
  /* car_set field */
  getSetByTxt(setCode)
  {
    return new Promise(
    (resolve, reject) => {
      fetch('../../assets/data/sets.json').then(res => res.json())
      .then(jsonSet => {
        for(let idx in jsonSet){
          var vSet = jsonSet[idx];
          if(vSet.set_code == setCode){
            var setId = vSet.set_id;
            this.getSet(setId).then(retSet => {
              resolve(retSet);
            });
          }
        }
      })
      .catch((err) => {
        reject('Error fetching Set! Message:' + err);
      });
    });
  }

  getSetCards(setId){
    return new Promise(
    (resolve, reject) => {
      fetch('../../assets/data/set_cards.json').then(res => res.json()).then(jsonSetCards => {
        resolve(jsonSetCards[setId]);
      })
      .catch(err => {
        reject(err);
      });
    });
  }
}
