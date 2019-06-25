import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TbSetService } from './TbSet/tb-set.service';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';

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
    public TbSet: TbSetService,
    private file: File,
    public storage: Storage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));

      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#ffffff');

      this.checkFirstTimeDb();
      this.splashScreen.hide();
    });
  }

  checkFirstTimeDb(){
    this.checkJsonTbSet();
  }

  checkJsonTbSet(){
    this.TbSet.getJsonTbSet().then((jsonTbSet) => {
      this.storage.set('tb_set', jsonTbSet);
      if(this.isApp){
        this.file.removeFile('../assets/data/', 'sets.json').then( data => {
          console.log('removeu');
        });
      }
    });
  }
}
