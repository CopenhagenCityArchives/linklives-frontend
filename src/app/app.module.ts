import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SearchModule } from './search/search.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './result-list/search-result-list.component';
import { PersonalAppearanceComponent } from './personal-appearance/personal-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchResultListComponent,
    PersonalAppearanceComponent,
    LifeCourseComponent,
  ],
  imports: [
    BrowserModule,
    SearchModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
