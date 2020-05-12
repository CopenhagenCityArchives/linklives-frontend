import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './result-list/search-result-list.component';

import { SearchResultResolverService } from './search-result-resolver.service';
import { PersonalAppearanceComponent } from './personal-appearance/personal-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { ItemResolverService } from './item-resolver.service';


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
    component: PersonalAppearanceComponent,
    resolve: {
      pa: ItemResolverService
    },
    data: {
      index: 'pas',
    }
  },
  {
    path: 'life-course/:id',
    component: LifeCourseComponent,
    resolve: {
      pas: ItemResolverService
    },
    data: {
      index: 'lifecourses'
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
