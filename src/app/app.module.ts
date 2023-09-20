import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// Import the module from the SDK
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
// Import the injector module and the HTTP client module from Angular
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SearchModule } from './search/search.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoadingOverlay } from './loading-overlay/component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { SourceLinkingGraphComponent } from './life-course/source-linking-graph.component';
import { PersonAppearanceItemComponent } from './person-appearance/person-appearance-item.component';
import { LifeCourseItemComponent } from './life-course/life-course-item.component';
import { FormElementsModule } from './form-elements.module';
import { SearchHistoryComponent } from './search-history/component';
import { LinkRatingComponent } from './link-rating/component';
import { FilterSidebar } from './filter-sidebar/component';
import { RelatedPeopleComponent } from './person-appearance/related-people.component';
import { SourceDataComponent } from './person-appearance/source-data.component';
import { UserProfilePage } from './user-profile/user-profile.component';
import { ModalComponent } from './modal/component';
import { environment } from 'src/environments/environment';
import { AnalyticsModule } from './analytics.module';
import { UserManagementService } from './user-management/service';
import { DownloadDataLink } from './download-data-link/component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoadingOverlay,
    SearchResultListComponent,
    PersonAppearanceComponent,
    RelatedPeopleComponent,
    SourceDataComponent,
    LifeCourseComponent,
    SourceLinkingGraphComponent,
    PersonAppearanceItemComponent,
    LifeCourseItemComponent,
    SearchHistoryComponent,
    LinkRatingComponent,
    FilterSidebar,
    UserProfilePage,
    ModalComponent,
    DownloadDataLink,
  ],
  imports: [
    BrowserModule,
    SearchModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormElementsModule,
    HttpClientModule,
    AnalyticsModule,
    AuthModule.forRoot({
      domain: 'linklives.eu.auth0.com',
      clientId: environment.auth0ClientId,
      audience: 'https://api.linklives.dk',
      redirectUri: UserManagementService.baseUrl,
      httpInterceptor: {
        allowedList: [

          // Auth0 authentication endpoint
          {
            uri: 'https://linklives.eu.auth0.com/api/v2/*',
            tokenOptions: { audience: 'https://linklives.eu.auth0.com/api/v2/' },
          },

          // API endpoints used with authentication
          ...[
            "/LinkRating",
            "/user/ratings/lifecourses",
            "/manage/User/*",
            "/manage/User",
          ].map((path) => {
            return {
              uri: `${environment.apiUrl}${path}`,
              tokenOptions: { audience: 'https://api.linklives.dk' },
            };
          }),

          // Download links are POST methods, so match on that here
          // This avoids matching GET endpoints for getting info on the items
          ...[
            "/search/*",
            "/PersonAppearance/*",
            "/LifeCourse/*",
          ].map((path) => {
            return {
              uri: `${environment.apiUrl}${path}`,
              tokenOptions: { audience: 'https://api.linklives.dk' },
              httpMethod: 'post',
            };
          }),
        ]
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
