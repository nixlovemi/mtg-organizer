import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalsService } from './globals.service';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { TbDeckService } from './TbDeck/tb-deck.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Card List',
      url: '/card-list',
      icon: 'apps'
    },
    {
      title: 'Decks',
      url: '/pg-deck-home',
      icon: 'cube'
    },
    {
      title: 'Collection',
      url: '/collection',
      icon: 'folder'
    },
    {
      title: 'Life Counter',
      url: '/life-counter',
      icon: 'heart'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle-outline'
    }
  ];
  isApp           = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalServ: GlobalsService,
    private file: File,
    private storage: Storage,
    public DeckSrv: TbDeckService,
  ) {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
      this.globalServ.setIsApp(this.isApp);

      this.initLocalDb();
      this.loadInfoGlobals();
      this.createAppFolders();

      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#ffffff');

      this.splashScreen.hide();
    });
  }

  async initLocalDb()
  {
    // decks
    var tb_deck = await this.DeckSrv.getDeckData();
    if(tb_deck == null){
      this.DeckSrv.initEmptyTbDeck();
      this.DeckSrv.initEmptyTbDeckCards();
    }
    // =====
  }

  createAppFolders()
  {
    if(this.isApp){
      this.createCardImageFolder();
      this.createDataFolder();
    }
  }

  private createCardImageFolder()
  {
    var dirName = 'card_images';

    this.file.checkDir(this.file.dataDirectory, dirName).then(response => {
		}).catch(err => {
			this.file.createDir(this.file.dataDirectory, dirName, false).then(response => {
			}).catch(err => {
			});
		});
  }

  private createDataFolder()
  {
    var dirName = 'data';

    this.file.checkDir(this.file.dataDirectory, dirName).then(response => {
    }).catch(err => {
      this.file.createDir(this.file.dataDirectory, dirName, false).then(response => {
      }).catch(err => {
      });
    });
  }

  loadInfoGlobals()
  {
    fetch('../../assets/data/cards.json').then(res => res.json()).then(jsonCards => {
      this.globalServ.setArrCards(jsonCards);
    });
    fetch('../../assets/data/cards_name.json').then(res => res.json()).then(jsonCardsName => {
      this.globalServ.setArrCardsName(jsonCardsName);
    });
    fetch('../../assets/data/sets.json').then(res => res.json()).then(jsonSet => {
      let arrSets    = [];
      var arrSetKeys = Object.keys(jsonSet);
      for(var i=0; i<arrSetKeys.length; i++){
        var setKey = arrSetKeys[i];
        var Set    = jsonSet[setKey];

        arrSets.push(Set);
      }

      this.orderSets(arrSets);
    });
  }

  async orderSets(arrSets)
  {
    function date_sort(a, b) {
      return new Date(b.set_released_at).getTime() - new Date(a.set_released_at).getTime();
    }
    await arrSets.sort(date_sort);
    this.globalServ.setArrSet(arrSets);
  }
}
