import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'lls-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <a class="lls-link" routerLink="/my-page">
        Gå til min side
      </a>
      <a
        (click)="auth.logout({ returnTo: document.location.origin })"
        class="lls-link u-ml-4"
      >
        Log ud
      </a>
    </ng-container>

    <ng-template #loggedOut>
      <a
        (click)="auth.loginWithRedirect({
          redirect_uri: window.location.href
        })"
        class="lls-link"
      >
        Log ind
      </a>
    </ng-template>
  `,
  styles: [],
})
export class AuthButtonComponent {
  window = window;
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {
    if(this.document.location.origin) {
      console.log('document.location.origin', this.document.location.origin);
    } else {
      console.log('no auth :(')
    }
  }
}