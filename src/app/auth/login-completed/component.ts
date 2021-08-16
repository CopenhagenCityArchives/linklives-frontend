import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-completed',
  template: '',
})
export class LoginCompletedComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService) { }

  ngOnInit(): void {
    let path = localStorage.getItem('login-completed-path');
    let queryString = localStorage.getItem('login-completed-query');
    localStorage.removeItem('login-completed-path');
    localStorage.removeItem('login-completed-query');
    let queryParams;
    if(!path) {
      this.router.navigate(['']);
      return;
    }
    if(!queryString) {
      this.router.navigate([path]);
      return;
    }

    queryParams = JSON.parse('{"' + queryString.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    this.router.navigate([path], {
      queryParams,
    });
  }

}
