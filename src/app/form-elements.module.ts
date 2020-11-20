import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Dropdown } from './form-elements/dropdown/component';

@NgModule({
  declarations: [
    Dropdown,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    Dropdown,
  ],
})
export class FormElementsModule { }
