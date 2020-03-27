import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './result-list/search-result-list.component';

import { SearchResultResolverService } from './search-result-resolver.service';


const routes: Routes = [
  {
    path: 'results',
    component: SearchResultListComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      searchResult: SearchResultResolverService
    }
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
