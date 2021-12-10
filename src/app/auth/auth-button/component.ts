import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UserManagementService } from 'src/app/user-management/service';

@Component({
  selector: 'lls-auth-button',
  templateUrl: './component.html',
})

export class AuthButtonComponent {
  window = window;
  constructor(@Inject(DOCUMENT) public document: Document, private userManagement: UserManagementService, public auth: AuthService) { }

  login() {
    this.userManagement.handleLogin();
  }

  logout() {
    this.userManagement.handleLogout();
  }
}
