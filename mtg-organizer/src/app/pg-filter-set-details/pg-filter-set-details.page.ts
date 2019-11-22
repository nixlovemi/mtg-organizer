import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-pg-filter-set-details',
  templateUrl: './pg-filter-set-details.page.html',
  styleUrls: ['./pg-filter-set-details.page.scss'],
})
export class PgFilterSetDetailsPage implements OnInit {
  vFilters;

  constructor(
    public modalController: ModalController,
    private utils: UtilsService,
    public navParams: NavParams,
  ) {
    if( this.navParams.get('vCurrentFilters') != null ){
      this.vFilters = this.navParams.get('vCurrentFilters');
    } else {
      this.initFilters();
    }
  }

  ngOnInit() { }

  initFilters()
  {
    this.vFilters = {
      card_number:null,
      card_name:null,
      type:null,
      rarity:null,
      colors:null
    };
  }

  closeModal()
  {
    this.modalController.dismiss({
      'apply': false,
      'filters': this.vFilters
    });
  }

  numberOnlyValidation(event: any)
  {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  applyFilters()
  {
    this.modalController.dismiss({
      'apply': true,
      'filters': this.vFilters
    });
  }

  clearFilters()
  {
    this.initFilters();
  }

}
