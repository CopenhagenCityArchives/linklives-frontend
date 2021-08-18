import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { AuthUtil } from '../util';

@Component({
  selector: 'lls-auth-button',
  templateUrl: './component.html',
})

export class AuthButtonComponent {
  window = window;
  constructor(@Inject(DOCUMENT) public document: Document, private authUtil: AuthUtil, public auth: AuthService) { }

  login() {
    console.log('trying to login')
    this.authUtil.handleLogin();
  }
}
