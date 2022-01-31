import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { SimpleSearchComponent } from './simple/search-simple.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      { path: '', component: SimpleSearchComponent }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
