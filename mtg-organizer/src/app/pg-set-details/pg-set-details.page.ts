import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TbSetService } from '../TbSet/tb-set.service';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../component/image-viewer/image-viewer.component';
import { TbCardsService } from '../TbCards/tb-cards.service';
import { LoadingController } from '@ionic/angular';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-pg-set-details',
  templateUrl: './pg-set-details.page.html',
  styleUrls: ['./pg-set-details.page.scss'],
})
export class PgSetDetailsPage implements OnInit {

  Set: any;
  vSetName = '';
  vSetCards = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private TbSet: TbSetService,
    private file: File,
    private modalController: ModalController,
    private TbCard: TbCardsService,
    private loadingCtr: LoadingController,
    private globalServ: GlobalsService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        var vSetId = this.router.getCurrentNavigation().extras.state.setId;
        this.TbSet.getSet(vSetId).then((retSet:any) => {
          this.Set      = retSet;
          this.vSetName = this.Set.set_name;
        });
      }
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loadingCtr.create({
      message: 'Loading, please wait',
      spinner: 'dots',
    }).then((res) => {
      res.present();

      var vSetId = '-1';
      if(typeof this.Set != 'undefined'){
        vSetId = this.Set.set_id;
      }

      this.loadCardsBySet(vSetId).then((ret) => {
        res.dismiss();
      })
      .catch((ret) => {
        res.dismiss();
      });

      res.onDidDismiss().then((dis) => { });
    });
  }

  loadCardsBySet(vSetId){
    return new Promise(
    (resolve, reject) => {
      let arrCards = this.globalServ.getArrCards();

      this.TbSet.getSetCards(vSetId).then((arrSetCards:any) => {
        for(var i=0; i<arrSetCards.length; i++){
          let cardId = arrSetCards[i];
          this.TbCard.getHtmlCardId(cardId).then((htmlCard) => {
            var infoCard = {
              id   : cardId,
              name : arrCards[cardId].car_name,
              html : htmlCard,
            };
            this.vSetCards.push(infoCard);
          });
        }
        resolve(true);
      })
      .catch((err) => {
        reject(false);
      });
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

  /*
  this part of the app works only once on IOS
  its a better way to show images but need some work

  import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
  */
  /*showImage(url, cardName){
    // url = www/assets/card_images/0000579f-7b35-4ed3-b44c-db2a538066fe-1.jpg
    // var idxSlash    = url.lastIndexOf('/')+1;
    // var imgName     = url.substr(idxSlash);
    var imgName     = url.split('\\').pop().split('/').pop();
    var imgPath     = url.replace(imgName, '');
    var tempImgName = 'imgTempSet.jpg';

    //const ROOT_DIRECTORY     = this.file.dataDirectory; // works on IOS
    const ROOT_DIRECTORY     = this.file.externalRootDirectory;
    const downloadFolderName = 'tempDownloadFolder';

    //Create a folder in memory location
    this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
    .then((entries) => {
      //Copy our asset/img/logo.jpg to folder we created
      this.file.copyFile(this.file.applicationDirectory + imgPath, imgName, ROOT_DIRECTORY + downloadFolderName + '//', tempImgName)
        .then((entries) => {
          var options = {
            share: true, // default is false
            closeButton: false, // default is true
            copyToReference: true, // default is false
            headers: '',  // If this is not provided, an exception will be triggered
            piccasoOptions: { } // If this is not provided, an exception will be triggered
          };

          this.photoViewer.show(ROOT_DIRECTORY + downloadFolderName + "/" + tempImgName, cardName, options);
          this.file.removeFile(ROOT_DIRECTORY + downloadFolderName + "/", tempImgName).then( data => {
            console.log('removeu');
          });
        })
        .catch((error) => {
          alert('1 error ' + JSON.stringify(error));
        });
    })
    .catch((error) => {
      alert('2 error' + JSON.stringify(error));
    });
  }*/
}
