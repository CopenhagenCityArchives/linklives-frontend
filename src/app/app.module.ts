import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFreetextComponent } from './search-freetext/search-freetext.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFreetextComponent,
    PageNotFoundComponent,
    SearchResultListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
