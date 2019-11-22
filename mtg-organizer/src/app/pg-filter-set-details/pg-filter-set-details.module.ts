import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgFilterSetDetailsPage } from './pg-filter-set-details.page';

const routes: Routes = [
  {
    path: '',
    component: PgFilterSetDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgFilterSetDetailsPage]
})
export class PgFilterSetDetailsPageModule {}
