import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'lls-auth-button',
  templateUrl: './component.html',
})

export class AuthButtonComponent {
  window = window;
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) { }

  login() {
    const onLoginCompleted = {
      path: window.location.pathname,
    };

    if(window.location.search.length > 1) {
      onLoginCompleted['query'] = window.location.search.substring(1);
    }
    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));

    this.auth.loginWithRedirect({
      appState: { target: 'login-completed' }
    })
  }
}
