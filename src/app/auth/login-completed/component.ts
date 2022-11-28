import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { getObjectFromQueryString } from '../../util/util';

@Component({
  selector: 'app-login-completed',
  template: '',
})
export class LoginCompletedComponent implements OnInit {

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    console.log("on login completed");
    const stateString = localStorage.getItem('onLoginCompleted');
    const onLoginChanged = (window as any).lls__onLoginChanged;
    if(onLoginChanged) {
      onLoginChanged(true);
    }

    if(!stateString) {
      console.warn('missing onLoginCompleted in localstorage after login completed; redirecting to /');
      this.router.navigate(['']);
      return;
    }

    let path, query;
    try {
      const result = JSON.parse(stateString);
      path = result.path;
      query = result.query;
    }
    catch(error) {
      console.warn('unparseable onLoginCompleted in localstorage after login completed; redirecting to /');
      localStorage.removeItem('onLoginCompleted');
      this.router.navigate(['']);
      return;
    }

    let queryParams;
    if(query) {
      queryParams = getObjectFromQueryString(query);

      // Overwrite path with redirect URI if any, remove from query params set
      path = queryParams.redirect_uri || path;
      delete queryParams.redirect_uri;
    }

    localStorage.removeItem('onLoginCompleted');

    if(!path) {
      console.warn('missing path on onLoginCompleted');
      this.router.navigate(['']);
      return;
    }

    // Some special pages should never be shown, so we just redirect to home after login instead
    const specialList = [
      /^\/login(\/|$)/,
      /^\/logout(\/|$)/,
    ]
    if(specialList.some((specialPath) => specialPath.test(path))) {
      this.router.navigate(['']);
      return;
    }

    this.router.navigate([path], { queryParams });
  }
}
