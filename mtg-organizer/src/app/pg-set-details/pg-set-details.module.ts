import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgSetDetailsPage } from './pg-set-details.page';

const routes: Routes = [
  {
    path: '',
    component: PgSetDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgSetDetailsPage]
})
export class PgSetDetailsPageModule {}
