import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';

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
//import { AuthButtonComponent } from './auth/auth0.component';
import { UserProfileComponent } from './auth/user-profile/component';
import { FilterSidebar } from './filter-sidebar/component';
import { RelatedPeopleComponent } from './person-appearance/related-people.component';
import { SourceDataComponent } from './person-appearance/source-data.component';
import { UserProfilePage } from './user-profile/user-profile.component';

import { UserMetadataComponent } from './test/api-caller';

// Import the injector module and the HTTP client module from Angular
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Import the HTTP interceptor from the Auth0 Angular SDK
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

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
    UserMetadataComponent,
//    AuthButtonComponent,
    UserProfileComponent,
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
    // Import the module into the application, with configuration
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'linklives.eu.auth0.com',
      clientId: '7lYbAwzUER3epciKfadgIoO8LUmhIk5x',
        // Request this audience at user authentication time
      audience: 'https://linklives.eu.auth0.com/api/v2/',

      // Request this scope at user authentication time
      scope: 'read:current_user',

      // Specify configuration for the interceptor              
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: 'https://linklives.eu.auth0.com/api/v2/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://linklives.eu.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope: 'read:current_user'
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
