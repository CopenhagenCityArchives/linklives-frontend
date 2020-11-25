import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Dropdown } from './form-elements/dropdown/component';
import { Boolean } from './form-elements/boolean/component';

@NgModule({
  declarations: [
    Dropdown,
    Boolean,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    Dropdown,
    Boolean,
  ],
})
export class FormElementsModule { }
