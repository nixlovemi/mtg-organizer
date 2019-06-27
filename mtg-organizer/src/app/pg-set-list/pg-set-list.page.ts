import { Component, OnInit } from '@angular/core';
import { TbSetService } from '../TbSet/tb-set.service';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pg-set-list',
  templateUrl: './pg-set-list.page.html',
  styleUrls: ['./pg-set-list.page.scss'],
})
export class PgSetListPage implements OnInit {

  vSets       = [];
  vShowLoader = false;

  constructor(
    public TbSet: TbSetService,
    public loadingCtr: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loadingCtr.create({
      message: 'Loading, please wait',
      spinner: 'dots',
    }).then((res) => {
      res.present();

      this.TbSet.getAllSets(50).then((arrSet:any) => {
        this.vSets = arrSet.arraySets;
      });

      res.dismiss();
      res.onDidDismiss().then((dis) => { });
    });
  }

  filterList(evt) {
    this.vShowLoader = true;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.TbSet.getAllSets(50).then((arrSet:any) => {
        this.vSets = arrSet.arraySets;
        this.vShowLoader = false;
      });

      return;
    }

    this.filterSets(searchTerm).then((ret) => {
      this.vShowLoader = false;
    });
  }

  filterSets(filter){
    return new Promise(
    (resolve, reject) => {
      this.TbSet.getAllSets(50, filter).then((arrSet:any) => {
        this.vSets = arrSet.arraySets;
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
    });
  }

  detailSet(setId){
    let navigationExtras: NavigationExtras = {
      state: {
        setId: setId
      }
    };
    this.router.navigate(['set-details'], navigationExtras);
  }
}
