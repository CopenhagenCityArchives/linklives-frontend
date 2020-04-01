import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { SimpleSearchComponent } from './simple/search-simple.component';
import { AdvancedSearchComponent } from './advanced/search-advanced.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    children: [
      { path: 'simple', component: SimpleSearchComponent },
      { path: 'advanced', component: AdvancedSearchComponent },
      { path: '', redirectTo: 'simple', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }