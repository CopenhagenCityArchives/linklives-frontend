import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SimpleSearchComponent } from './simple/search-simple.component';

@NgModule({
  declarations: [
    SearchComponent,
    SimpleSearchComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SearchRoutingModule,
    FormsModule
  ]
})
export class SearchModule { }
