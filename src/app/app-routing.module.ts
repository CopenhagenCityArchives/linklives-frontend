import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';

import { SearchResultResolverService } from './search-result-list/search-result-resolver.service';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { PersonAppearanceResolverService } from './person-appearance/person-appearance-resolver.service';
import { LifeCourseResolverService } from './life-course/life-course-resolver.service';
import { RelatedPeopleComponent } from './person-appearance/related-people.component';
import { SourceDataComponent } from './person-appearance/source-data.component';
import { UserProfilePage } from './user-profile/user-profile.component';
import { LoginCompletedComponent } from './auth/login-completed/component';
import { AuthGuard } from '@auth0/auth0-angular';


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
    children: [
      { path: 'related-people', component: RelatedPeopleComponent },
      { path: 'source-data', component: SourceDataComponent },
      { path: '', redirectTo: 'source-data', pathMatch: 'full' },
    ],
    resolve: {
      item: PersonAppearanceResolverService
    },
  },
  {
    path: 'life-course/:key',
    component: LifeCourseComponent,
    resolve: {
      lifecourse: LifeCourseResolverService
    },
  },
  {
    path: 'my-page',
    component: UserProfilePage,
    canActivate: [AuthGuard],
  },
  { path: 'login-completed', component: LoginCompletedComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
