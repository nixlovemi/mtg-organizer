import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgDeckHomePage } from './pg-deck-home.page';

const routes: Routes = [
  {
    path: '',
    component: PgDeckHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgDeckHomePage]
})
export class PgDeckHomePageModule {}
