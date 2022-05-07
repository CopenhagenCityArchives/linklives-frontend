import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/user-management/service';

@Component({
  selector: 'lls-login',
  template: '',
})
export class LoginComponent implements OnInit {
  constructor(private userManagement: UserManagementService) { }

  ngOnInit() {
    this.userManagement.handleLogin();
  }
}
