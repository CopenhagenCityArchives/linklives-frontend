import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthUtil {
  constructor(public auth: AuthService) { }

  handleLogin() {
    console.log('window.location.pathname', window.location.pathname);
    const path = window.location.pathname.replace('find-livsforloeb-testversion/', '');
    console.log('path', path);
    const onLoginCompleted = {
      path,
    };
  
    if(window.location.search.length > 1) {
      onLoginCompleted['query'] = window.location.search.substring(1);
    }
    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));
  
    console.log('now lets call auth service!');
    this.auth.loginWithRedirect({
      //appState: { target: 'find-livsforloeb-testversion/login-completed' }
      redirect_uri: 'https://link-lives.dk/find-livsforloeb-testversion/login-completed',// window.location.href
    })
  }
}
