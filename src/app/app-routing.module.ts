import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './result-list/search-result-list.component';

import { SearchResultResolverService } from './search-result-resolver.service';
import { PersonalAppearanceComponent } from './personal-appearance/personal-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';


const routes: Routes = [
  {
    path: 'results',
    pathMatch: 'full',
    component: SearchResultListComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      searchResult: SearchResultResolverService
    }
  },
  {
    path: 'pa/:id',
    component: PersonalAppearanceComponent
  },
  {
    path: 'life-course/:id',
    component: LifeCourseComponent
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
