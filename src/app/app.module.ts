import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { SearchModule } from './search/search.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { PersonAppearanceComponent } from './person-appearance/person-appearance.component';
import { LifeCourseComponent } from './life-course/life-course.component';
import { PersonAppearanceItemComponent } from './person-appearance/person-appearance-item.component';
import { LifeCourseItemComponent } from './life-course/life-course-item.component';
import { FormElementsModule } from './form-elements.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchResultListComponent,
    PersonAppearanceComponent,
    LifeCourseComponent,
    PersonAppearanceItemComponent,
    LifeCourseItemComponent,
  ],
  imports: [
    BrowserModule,
    SearchModule,
    AppRoutingModule,
    FormsModule,
    FormElementsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
