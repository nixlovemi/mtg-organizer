import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pg-home/pg-home.module#PgHomePageModule'
  },
  {
    path: 'card-list',
    loadChildren: './pg-card-list/pg-card-list.module#PgCardListPageModule'
  },
  {
    path: 'decks',
    loadChildren: './pg-decks/pg-decks.module#PgDecksPageModule'
  },
  {
    path: 'collection',
    loadChildren: './pg-collection/pg-collection.module#PgCollectionPageModule'
  },
  {
    path: 'life-counter',
    loadChildren: './pg-life-counter/pg-life-counter.module#PgLifeCounterPageModule'
  },
  {
    path: 'about',
    loadChildren: './pg-about/pg-about.module#PgAboutPageModule'
  },
  { path: 'pg-set-list', loadChildren: './pg-set-list/pg-set-list.module#PgSetListPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
