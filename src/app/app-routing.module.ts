import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';

import { SearchResultResolverService } from './search-result-list/search-result-resolver.service';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { PersonAppearanceResolverService } from './person-appearance/person-appearance-resolver.service';
import { LifeCourseResolverService } from './life-course/life-course-resolver.service';


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
    component: PersonAppearanceComponent,
    resolve: {
      item: PersonAppearanceResolverService
    },
  },
  {
    path: 'life-course/:id',
    component: LifeCourseComponent,
    resolve: {
      lifecourse: LifeCourseResolverService
    },
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
