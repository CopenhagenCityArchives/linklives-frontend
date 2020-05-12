import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SearchModule } from './search/search.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './result-list/search-result-list.component';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchResultListComponent,
    PersonAppearanceComponent,
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
