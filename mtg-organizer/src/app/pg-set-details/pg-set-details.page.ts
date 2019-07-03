import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TbSetService } from '../TbSet/tb-set.service';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../component/image-viewer/image-viewer.component';
import { TbCardsService } from '../TbCards/tb-cards.service';
import { LoadingController } from '@ionic/angular';
import { GlobalsService } from '../globals.service';
import { Http, Response, Headers, RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { UtilsService } from '../utils.service';
import { saveAs } from 'file-saver';
import { Zip } from '@ionic-native/zip/ngx';

@Component({
  selector: 'app-pg-set-details',
  templateUrl: './pg-set-details.page.html',
  styleUrls: ['./pg-set-details.page.scss'],
})
export class PgSetDetailsPage implements OnInit {

  Set: any  = {
    set_name: "",
  };
  vIsApp    = false;
  vSavePath = '';

  vSetCards        = [];
  vSetCardsParts   = [];
  vLimit           = 60;
  vIdxCardsParts   = 0;
  vDisableInfinite = true;

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
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        var vSetId = this.router.getCurrentNavigation().extras.state.setId;
        this.TbSet.getSet(vSetId).then((retSet:any) => {
          this.Set = retSet;

          this.TbSet.getSetCards(this.Set.set_id).then((arrSetCards:any) => {
            while(arrSetCards.length) {
              this.vSetCardsParts.push(arrSetCards.splice(0,this.vLimit));
            }
          });
        });
      }
    });

    this.vIsApp    = this.globalServ.getIsApp();
    this.vSavePath = this.globalServ.getSavePath();
  }

  ngOnInit() {}

  ionViewDidEnter(){
    this.loadingCtr.create({
      message: 'Loading, please wait',
      spinner: 'dots',
    }).then((res) => {
      res.present();

      this.loadCardsBySet().then((ret) => {
        this.vDisableInfinite = false;
        res.dismiss();
      })
      .catch((ret) => {
        res.dismiss();
      });

      res.onDidDismiss().then((dis) => { });
    });
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

  loadCardsBySet(){
    return new Promise(
    (resolve, reject) => {
      let arrCards = this.globalServ.getArrCards();
      var arrLoop  = this.vSetCardsParts[this.vIdxCardsParts];

      if(typeof arrLoop != 'undefined'){
        for(var i=0; i<arrLoop.length; i++){
          let cardId   = arrLoop[i];
          let Card     = arrCards[cardId];
          let infoCard = {
            id   : cardId,
            name : Card.car_name,
            html : '',
            path : '',
          };

          this.checkImageExists(Card.cim_url_app).then((result) => {
            this.file.readAsDataURL(this.vSavePath + 'card_images/', Card.cim_url_app).then(dataurl => {
              infoCard.path = dataurl;
              this.vSetCards.push(infoCard);
            })
            .catch((err) => {

            });
          })
          .catch((err) => {
            this.TbCard.getHtmlCardId(cardId).then((htmlCard:any) => {
              infoCard.html = htmlCard;
              this.vSetCards.push(infoCard);
            });
          });
        }
        resolve(true);
      } else {
        reject(false);
      }

      /*
      this.TbSet.getSetCards(vSetId).then((arrSetCards:any) => {
        for(var i=0; i<arrSetCards.length; i++){
          let cardId   = arrSetCards[i];
          let Card     = arrCards[cardId];
          let infoCard = {
            id   : cardId,
            name : Card.car_name,
            html : '',
            path : '',
          };

          this.checkImageExists(Card.cim_url_app).then((result) => {
            this.file.readAsDataURL(this.vSavePath + 'card_images/', Card.cim_url_app).then(dataurl => {
              infoCard.path = dataurl;
              this.vSetCards.push(infoCard);
            })
            .catch((err) => {

            });
          })
          .catch((err) => {
            this.TbCard.getHtmlCardId(cardId).then((htmlCard:any) => {
              infoCard.html = htmlCard;
              this.vSetCards.push(infoCard);
            });
          });

          if(i > 20){
            break;
          }
        }
        resolve(true);
      })
      .catch((err) => {
        reject(false);
      });
      */
    });
  }

  loadData(){
    this.loadingCtr.create({
      message: 'Loading, please wait',
      spinner: 'dots',
    }).then((res) => {
      res.present();

      this.vIdxCardsParts = this.vIdxCardsParts + 1;

      setTimeout(() => {
        this.loadCardsBySet().then((response) => {
          res.dismiss();

          var testIfFinishCardsParts = this.vSetCardsParts[this.vIdxCardsParts + 1];
          if(typeof testIfFinishCardsParts == "undefined"){
            this.vDisableInfinite = true;
          }
        })
        .catch((response) => {
          this.vDisableInfinite = true;
          res.dismiss();
        });
      }, 500);
    });
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

  execDwldSetImg(vSetCode, vSetId){
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
        headers: new Headers({'Content-type': 'application/json'})
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
      });
    });
  }
}
