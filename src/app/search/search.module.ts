import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SimpleSearchComponent } from './simple/search-simple.component';
import { AdvancedSearchComponent } from './advanced/search-advanced.component';
import { SearchFieldComponent } from './search-field/search-field.component';
import { FormElementsModule } from '../form-elements.module';
import { AuthButtonComponent } from '../auth/auth0.component';

@NgModule({
  declarations: [
    SearchComponent,
    SimpleSearchComponent,
    AdvancedSearchComponent,
    SearchFieldComponent,
    AuthButtonComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SearchRoutingModule,
    FormsModule,
    FormElementsModule,
  ]
})
export class SearchModule { }
