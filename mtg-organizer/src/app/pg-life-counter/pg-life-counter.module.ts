import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgLifeCounterPage } from './pg-life-counter.page';

const routes: Routes = [
  {
    path: '',
    component: PgLifeCounterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgLifeCounterPage]
})
export class PgLifeCounterPageModule {}
