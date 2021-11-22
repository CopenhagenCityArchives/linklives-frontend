import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { SimpleSearchComponent } from './simple/search-simple.component';
import { AdvancedSearchComponent } from './advanced/search-advanced.component';
import { SearchSimpleResolverService } from './simple/search-simple-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      { path: '', component: SimpleSearchComponent }
    ],
    resolve: {
      sourceCounts: SearchSimpleResolverService,
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
