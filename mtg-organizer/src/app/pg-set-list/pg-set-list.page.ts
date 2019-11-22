import { Component, OnInit, ViewChild } from '@angular/core';
import { TbSetService } from '../TbSet/tb-set.service';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-pg-set-list',
  templateUrl: './pg-set-list.page.html',
  styleUrls: ['./pg-set-list.page.scss'],
})
export class PgSetListPage implements OnInit {
  // @ViewChild('mySearchbar') searchbar: Searchbar;
  vSets       = [];
  vShowLoader = false;

  constructor(
    public TbSet: TbSetService,
    public loadingCtr: LoadingController,
    private router: Router,
    private utils: UtilsService,
  ) { }

  doRefresh(event)
  {
    setTimeout(() => {
      // this.searchbar.clearInput(null);
      this.loadAllSets();
      event.target.complete();
    }, 2000);
  }

  async ngOnInit()
  {
    await this.loadAllSets();
  }

  async loadAllSets(count=50, filter='')
  {
    await this.utils.getLoader('Loading, please wait', 'dots');

    var arrSet;
    arrSet     = await this.TbSet.getAllSets(count, filter);
    this.vSets = arrSet["arraySets"];

    await this.utils.closeLoader();
  }

  async ionViewDidEnter(){ }

  async filterList(evt)
  {
    this.vShowLoader = true;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      await this.loadAllSets(50);
      this.vShowLoader = false;
      return;
    }

    await this.loadAllSets(50, searchTerm);
    this.vShowLoader = false;
  }

  async filterSets(filter)
  {
    await this.loadAllSets(50, filter);
  }

  detailSet(setId)
  {
    let navigationExtras: NavigationExtras = {
      state: {
        setId: setId
      }
    };
    this.router.navigate(['set-details'], navigationExtras);
  }
}
