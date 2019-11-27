import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgDeckHomeAddPage } from './pg-deck-home-add.page';

const routes: Routes = [
  {
    path: '',
    component: PgDeckHomeAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgDeckHomeAddPage]
})
export class PgDeckHomeAddPageModule {}
