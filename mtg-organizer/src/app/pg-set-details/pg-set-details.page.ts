import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TbSetService } from '../TbSet/tb-set.service';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../component/image-viewer/image-viewer.component';
import { PgFilterSetDetailsPage } from '../pg-filter-set-details/pg-filter-set-details.page';
import { TbCardsService } from '../TbCards/tb-cards.service';
import { LoadingController } from '@ionic/angular';
import { GlobalsService } from '../globals.service';
import { Http, Response, Headers, RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { UtilsService } from '../utils.service';
import { saveAs } from 'file-saver';
import { Zip } from '@ionic-native/zip/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-pg-set-details',
  templateUrl: './pg-set-details.page.html',
  styleUrls: ['./pg-set-details.page.scss'],
})
export class PgSetDetailsPage implements OnInit {
  Set: any  = {
    set_name: "",
  };
  vIsApp           = false;
  vSavePath        = '';
  vCurrentFilters  = null;

  vSetCards        = [];
  vSetCardsParts   = [];
  vLimit           = 60;
  vIdxCardsParts   = 0;
  vIdxCardsPartsMx = 0;
  vDisableInfinite = true;
  vColSize         = 6;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private TbSet: TbSetService,
    private file: File,
    private modalController: ModalController,
    private TbCard: TbCardsService,
    private loadingCtr: LoadingController,
    private globalServ: GlobalsService,
    private http: Http,
    private utils: UtilsService,
    private zip: Zip,
    private zone: NgZone,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        var vSetId = this.router.getCurrentNavigation().extras.state.setId;
        this.init(vSetId);
      }
    });
  }

  ngOnInit() {}

  async init(vSetId)
  {
    this.Set           = await this.TbSet.getSet(vSetId);
    var arrSetCards    = await this.TbSet.getSetCards(this.Set.set_id);

    this.spliceSetCards(arrSetCards);

    this.vIsApp    = this.globalServ.getIsApp();
    this.vSavePath = this.globalServ.getSavePath();
  }

  spliceSetCards(arrSetCards){
    var vIdxCardsPartsMx = null;

    if(arrSetCards.length <= this.vLimit){
      this.vSetCardsParts.push(arrSetCards);
      vIdxCardsPartsMx = 0;
    } else {
      while(arrSetCards.length) {
        this.vSetCardsParts.push(arrSetCards.splice(0,this.vLimit));
        if(vIdxCardsPartsMx == null){
          vIdxCardsPartsMx = 0;
        } else {
          vIdxCardsPartsMx++;
        }
      }
    }

    this.vIdxCardsPartsMx = vIdxCardsPartsMx;
  }

  async ionViewDidEnter(){
    await this.utils.getLoader('Loading, please wait', 'dots');

    await this.loadCardsBySet();

    await this.utils.closeLoader();
  }

  private checkImageExists(vCimUrlApp){
    return new Promise(
    (resolve, reject) => {
      let assetsPath;

      if(this.globalServ.getIsApp()){
        assetsPath = this.vSavePath + 'card_images/';
        this.file.checkFile(assetsPath, vCimUrlApp).then((result) => {
          if(result){
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          reject(false);
        });
      } else {
        //@todo in WEB cehck if this.vSavePath WORKS!
        assetsPath = this.file.applicationDirectory + 'assets/card_images/';
        fetch(assetsPath + vCimUrlApp).then(res => {
          if(res.ok){
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          reject(false);
        });
      }
    });
  }

  async loadCardsBySet(){
    let arrCards = this.globalServ.getArrCards();
    var arrLoop  = this.vSetCardsParts[this.vIdxCardsParts];

    if(typeof arrLoop != 'undefined'){
      //this.zone.run(() => {
        for(var i=0; i<arrLoop.length; i++){
          let cardId   = arrLoop[i];
          let Card     = arrCards[cardId];
          let infoCard = {
            id   : cardId,
            name : Card.car_name,
            html : '',
            path : '',
          };

          await this.getHtmlOrImage(Card.cim_url_app, cardId, infoCard);
        }
      //});
    }

    await this.checkDisableInfinite();
  }

  getHtmlOrImage(cim_url_app, cardId, infoCard)
  {
    return new Promise(
    (resolve, reject) => {
      this.zone.run(() => {
        if(this.globalServ.getIsApp()){
          this.file.readAsDataURL(this.vSavePath + 'card_images/', cim_url_app).then((dataurl) => {
            this.vColSize = 6;
            infoCard.path = dataurl;
            this.vSetCards.push(infoCard);
            resolve(true);
          })
          .catch((err) => {
            this.TbCard.getHtmlCardId(cardId).then((htmlCard) => {
              this.vColSize = 12;
              infoCard.html = htmlCard;
              this.vSetCards.push(infoCard);
              resolve(true);
            });
          });
        } else {
          this.TbCard.getHtmlCardId(cardId).then((htmlCard) => {
            this.vColSize = 12;
            infoCard.html = htmlCard;
            this.vSetCards.push(infoCard);
            resolve(true);
          });
        }
      });
    });
  }

  async loadData(){
    await this.utils.getLoader('Loading, please wait', 'dots');

    this.vDisableInfinite = true;
    this.vIdxCardsParts   = this.vIdxCardsParts + 1;
    await this.loadCardsBySet();

    await this.utils.closeLoader();
  }

  async showImage(url, cardName, description: string = '') {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imgSource: url,
        imgTitle: cardName,
        imgDescription: description
      },
      cssClass: 'modal-fullscreen',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  async execDwldSetImg(vSetCode, vSetId){
    this.utils.showAlert('Download Set Images', '', 'This process may take a while, be sure to have a nice internet connection.', [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {

        }
      }, {
        text: 'Okay!',
        handler: () => {
          this.loadingCtr.create({
            message: 'Loading, please wait',
            spinner: 'dots',
          }).then((res) => {
            res.present();

            this.downloadSetImages(vSetCode).then((response) => {
              this.vSetCards        = [];
              this.vDisableInfinite = false;
              this.vIdxCardsParts   = 0;

              this.loadCardsBySet().then((response) => {
                res.dismiss();
              });
            })
            .catch((err) => {
              res.dismiss();
            });
          });
        }
      }
    ]);
  }

  private downloadSetImages(vSetCode){
    return new Promise(
    (resolve, reject) => {
      let url      = this.utils.getWsPath() + '/Cards/downloadSetCardImages'
      let postData = {
        'appkey'  : this.utils.getAppKey(),
        'setCode' : vSetCode,
      };

      this.http.post(url, JSON.stringify(postData), {
        method: RequestMethod.Post,
        responseType: ResponseContentType.Blob,
        headers: new Headers({'Content-type': 'application/json'}),
      })
      .subscribe((response) => {
        var blob     = new Blob([response.blob()], {type: 'application/zip'});
        var filePath = '';
        var fileName = vSetCode + '.zip';

        if(this.globalServ.getIsApp()){
          filePath = this.vSavePath + '/card_images/';
          this.file.writeFile(filePath, fileName, blob, {replace: true}).then((response) => {
            this.zip.unzip(filePath + fileName, filePath, (progress) => {
              // console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%');
            })
            .then((result) => {
              if(result === 0){
                resolve(true);
              }
              if(result === -1){
                reject(false);
              }
            });
          })
          .catch((err) => {
            reject(false);
          });
        } else {
          filePath = fileName;
          saveAs(blob, filePath);
          resolve(true);
        }
      },
      (err) => {
        this.utils.showAlert('Error', '', 'We could not download the images this time. Try again later!', []);
        reject(false);
      });
    });
  }

  private checkDisableInfinite(){
    this.vDisableInfinite = (this.vIdxCardsParts >= this.vIdxCardsPartsMx);

    /*
    var testIfFinishCardsParts = this.vSetCardsParts[this.vIdxCardsParts + 1];
    if(typeof testIfFinishCardsParts == "undefined"){
      this.vDisableInfinite = true;
    }
    */
  }

  async presentFilter()
  {
    const modal = await this.modalController.create({
      component: PgFilterSetDetailsPage,
      componentProps: {
        'vCurrentFilters' : this.vCurrentFilters,
      }
    });
    await modal.present();

    const { data }       = await modal.onWillDismiss();
    this.vCurrentFilters = data.filters;
    if(data.apply){
      this.applyFilters(data.filters);
    }
  }

  async applyFilters(filters)
  {
    var originalSetCards  = await this.TbSet.getSetCards(this.Set.set_id);
    let arrCards          = await this.globalServ.getArrCards();
    let arrCardsName      = await this.globalServ.getArrCardsName();
    let filteredCards     = [];

    //console.log(arrCards3[0]);
    //console.log(arrCards3[49605], arrCards3[49606], arrCards3[49607], arrCards3[49608], arrCards3[49609]);
    //console.log(arrCards2[49605], arrCards2[49606], arrCards2[49607], arrCards2[49608], arrCards2[49609]);

    for(let idx in originalSetCards){
      var carId = originalSetCards[idx];
      var Card  = arrCards[carId];

      var vCardNumber = Card.car_collector_number; //of collection
      var vCardName   = Card.car_name;
      var vCarCdnId   = Card.car_cdn_id;
      var vCardType   = arrCardsName[vCarCdnId].car_type_line; //ex: Creature — Cat Beast
      var vCardRarity = arrCardsName[vCarCdnId].car_rarity;
      var vCardColors = arrCardsName[vCarCdnId].car_colors; //array

      var valid = true;

      // filter: card name
      if(filters.card_name != null && filters.card_name != "" && valid){
        var index = vCardName.toLowerCase().indexOf( filters.card_name.toLowerCase() );
        if(index <= -1){
          valid = false;
        }
      }
      // =================

      // filter: card number
      if(filters.card_number != null && filters.card_number != "" && valid){
        if(filters.card_number != vCardNumber){
          valid = false;
        }
      }
      // ===================

      // filter: card color
      if(filters.colors != null && filters.colors.length > 0 && valid){
        var hasColor = false;

        for(let idx in filters.colors){
          var filterColor   = filters.colors[idx];
          var arrCardColors = Array.from( vCardColors.replace(/[^a-zA-Z]+/g, "") );
          var arrayEmpty    = true;

          for(let idx2 in arrCardColors){
            arrayEmpty = false;

            var cardColor = arrCardColors[idx2];
            if(cardColor == filterColor){
              hasColor = true;
              break;
            }
          }

          // when tha card id COLORLESS, array is empty
          if(arrayEmpty && filterColor == 'colorless'){
            hasColor = true;
            break;
          }
        }

        valid = hasColor;
      }
      // ==================

      // filter: card rarity
      if(filters.rarity != null && filters.rarity.length && valid){
        var hasRarity = false;

        for(let idx in filters.rarity){
          var filterRarity = filters.rarity[idx];
          var index        = vCardRarity.toLowerCase().indexOf( filterRarity.toLowerCase() );
          if(index >= 0){
            hasRarity = true;
            break;
          }
        }

        valid = hasRarity;
      }
      // ===================

      // filter: card type
      if(filters.type != null && filters.type.length && valid){
        var hasType = false;

        for(let idx in filters.type){
          var filterType = filters.type[idx];
          var index      = vCardType.toLowerCase().indexOf( filterType.toLowerCase() );
          if(index >= 0){
            hasType = true;
            break;
          }
        }

        valid = hasType;
      }
      // =================

      if(valid){
        filteredCards.push(carId);
      }
    }

    this.vSetCardsParts = [];
    this.vSetCards      = [];

    await this.spliceSetCards(filteredCards);
    await this.loadCardsBySet();
  }
}
