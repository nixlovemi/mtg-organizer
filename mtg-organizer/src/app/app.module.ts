import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { ImageViewerComponent } from './component/image-viewer/image-viewer.component';
import { PgFilterSetDetailsPageModule } from './pg-filter-set-details/pg-filter-set-details.module';
import { Zip } from '@ionic-native/zip/ngx';

@NgModule({
  declarations: [AppComponent, ImageViewerComponent],
  entryComponents: [ImageViewerComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    PgFilterSetDetailsPageModule,
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    Zip,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
