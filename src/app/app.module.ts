import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
// Import the injector module and the HTTP client module from Angular
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

import { SearchModule } from './search/search.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoadingOverlay } from './loading-overlay/component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { PersonAppearanceItemComponent } from './person-appearance/person-appearance-item.component';
import { LifeCourseItemComponent } from './life-course/life-course-item.component';
import { FormElementsModule } from './form-elements.module';
import { SearchHistoryComponent } from './search-history/component';
import { LinkRatingComponent } from './link-rating/component';
import { FilterSidebar } from './filter-sidebar/component';
import { RelatedPeopleComponent } from './person-appearance/related-people.component';
import { SourceDataComponent } from './person-appearance/source-data.component';
import { UserProfilePage } from './user-profile/user-profile.component';

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
    PersonAppearanceItemComponent,
    LifeCourseItemComponent,
    SearchHistoryComponent,
    LinkRatingComponent,
    FilterSidebar,
    UserProfilePage,
  ],
  imports: [
    BrowserModule,
    SearchModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormElementsModule,
    HttpClientModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'linklives.eu.auth0.com',
      clientId: '7lYbAwzUER3epciKfadgIoO8LUmhIk5x',
      // Request this audience at user authentication time
      audience: 'https://api.linklives.dk',

      // Specify configuration for the interceptor
      httpInterceptor: {
        allowedList: [
          {
            // Match requests to the auth0 manager API
            uri: 'https://linklives.eu.auth0.com/api/v2/*',
            tokenOptions: {
              // The attached token should target this audience (auht0 API ID)
              audience: 'https://linklives.eu.auth0.com/api/v2/',
            }
          },
          {
            // Match requests to the custom API (test)
            uri: 'https://api-test.link-lives.dk/LinkRating',
            tokenOptions: {
              // The attached token should target this audience (auht0 API ID)
              audience: 'https://api.linklives.dk',
            }
          },
          {
            // Match requests to the custom API (test)
            uri: 'https://api-test.link-lives.dk/user/ratings/lifecourses',
            tokenOptions: {
              // The attached token should target this audience (auht0 API ID)
              audience: 'https://api.linklives.dk',
            }
          },
          {
            // Match requests to the custom API (production)
            uri: 'https://api.link-lives.dk/LinkRating',
            tokenOptions: {
              // The attached token should target this audience (auht0 API ID)
              audience: 'https://api.linklives.dk',
            }
          },
          {
            // Match requests to the custom API (test)
            uri: 'https://api.link-lives.dk/user/ratings/lifecourses',
            tokenOptions: {
              // The attached token should target this audience (auht0 API ID)
              audience: 'https://api.linklives.dk',
            }
          }
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
