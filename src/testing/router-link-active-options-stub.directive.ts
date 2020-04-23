import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[routerLinkActiveOptions]'
})
export class RouterLinkActiveOptionsStubDirective {
  @Input('routerLinkActiveOptions') options: any;
}