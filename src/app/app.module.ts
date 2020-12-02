import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

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
import { FilterSidebar } from './filter-sidebar/component';
import { RelatedPeopleComponent } from './person-appearance/related-people.component';
import { SourceDataComponent } from './person-appearance/source-data.component';

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
    FilterSidebar,
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
