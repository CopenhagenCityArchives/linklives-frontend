import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[queryParams]'
})
export class QueryParamsStubDirective {
  @Input('queryParams') queryParams: any;
}