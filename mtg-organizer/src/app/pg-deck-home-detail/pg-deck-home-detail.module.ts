import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgDeckHomeDetailPage } from './pg-deck-home-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PgDeckHomeDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgDeckHomeDetailPage]
})
export class PgDeckHomeDetailPageModule {}
