import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalsService } from './globals.service';

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
      url: '/decks',
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
  isApp = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalServ: GlobalsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));

      this.loadInfoGlobals();

      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#ffffff');

      this.splashScreen.hide();
    });
  }

  loadInfoGlobals(){
    fetch('../../assets/data/cards.json').then(res => res.json()) .then(jsonCards => {
      this.globalServ.setArrCards(jsonCards);
    });
    fetch('../../assets/data/cards_name.json').then(res => res.json()) .then(jsonCardsName => {
      this.globalServ.setArrCardsName(jsonCardsName);
    });
  }
}
