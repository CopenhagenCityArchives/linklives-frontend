import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'lls-auth-button',
  templateUrl: './component.html',
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

  login() {
    localStorage.setItem('login-completed-path', window.location.pathname)
    if(window.location.search.length > 1) {
      localStorage.setItem('login-completed-query', window.location.search.substring(1))
    }
    this.auth.loginWithRedirect({
      appState: { target: 'login-completed' }
    })
  }
}
