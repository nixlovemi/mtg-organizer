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
  {
    path: 'set-list',
    loadChildren: './pg-set-list/pg-set-list.module#PgSetListPageModule'
  },
  {
    path: 'set-details',
    loadChildren: './pg-set-details/pg-set-details.module#PgSetDetailsPageModule'
  },
  {
    path: 'pg-filter-set-details',
    loadChildren: './pg-filter-set-details/pg-filter-set-details.module#PgFilterSetDetailsPageModule'
  },
  {
    path: 'pg-deck-home',
    loadChildren: './pg-deck-home/pg-deck-home.module#PgDeckHomePageModule'
  },
  {
    path: 'pg-deck-home-detail/:deck_id',
    loadChildren: './pg-deck-home-detail/pg-deck-home-detail.module#PgDeckHomeDetailPageModule'
  },
  { path: 'pg-deck-home-add', loadChildren: './pg-deck-home-add/pg-deck-home-add.module#PgDeckHomeAddPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
