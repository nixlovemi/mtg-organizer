import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#ffffff');

      this.splashScreen.hide();
    });
  }
}
