import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'lls-auth-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <a class="lls-link lls-link--white" routerLink="/my-page">
        Gå til min side
      </a>
      <a (click)="auth.logout({ returnTo: document.location.origin })" class="lls-link lls-link--white u-ml-4">
        Log ud
      </a>

    </ng-container>

    <ng-template #loggedOut>
      <button (click)="auth.loginWithRedirect()" class="lls-link lls-link--white">Log ind</button>
    </ng-template>
  `,
  styles: [],
})
export class AuthButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {
    if(this.document.location.origin) {
      console.log('document.location.origin', this.document.location.origin);
    } else {
      console.log('no auth :(')
    }
  }
}