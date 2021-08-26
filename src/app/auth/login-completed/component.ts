import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { getObjectFromQueryString } from '../../util/util';

@Component({
  selector: 'app-login-completed',
  template: '',
})
export class LoginCompletedComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService) { }

  ngOnInit(): void {
    const stateString = localStorage.getItem('onLoginCompleted');

    if(!stateString) {
      console.warn('missing onLoginCompleted in locale storage');
      this.router.navigate(['']);
      return;
    }

    const { path, query } = JSON.parse(stateString);
    localStorage.removeItem('onLoginCompleted');

    let queryParams;
    if(!path) {
      console.warn('missing path on onLoginCompleted');
      this.router.navigate(['']);
      return;
    }
    if(!query) {
      this.router.navigate([path]);
      return;
    }

    queryParams = getObjectFromQueryString(query)
    this.router.navigate([path], {
      queryParams,
    });
  }
}
