import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFreetextComponent } from './search-freetext/search-freetext.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', redirectTo: '/simple-search', pathMatch: 'full' },
  { path: 'simple-search', component: SearchFreetextComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
