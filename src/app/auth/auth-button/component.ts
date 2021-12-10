import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserManagementService } from 'src/app/user-management/service';

@Component({
  selector: 'lls-auth-button',
  templateUrl: './component.html',
})

export class AuthButtonComponent implements OnInit {
  isAuthenticated: boolean = false;  

  constructor(private userManagement: UserManagementService, public auth: AuthService) { }

  ngOnInit() {
    this.auth.isAuthenticated$
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  login() {
    this.userManagement.handleLogin();
  }

  logout() {
    this.userManagement.handleLogout();
  }
}
