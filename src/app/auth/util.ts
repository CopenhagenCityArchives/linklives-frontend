import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthUtil {
  constructor(public auth: AuthService) { }

  handleLogin() {
    console.log('handle LogiN!');
    console.log('window.location.pathname', window.location.pathname);
    const path = this.currentPath();
    const target = this.currentTarget();
    console.log('currentTarget', target);
    console.log('path', path);
    const onLoginCompleted = {
      path,
    };
  
    if(window.location.search.length > 1) {
      onLoginCompleted['query'] = window.location.search.substring(1);
    }
    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));

    console.log('onLogin', onLoginCompleted); 
  
    console.log('now lets call auth service!');
    this.auth.loginWithRedirect({
      appState: { target }
      //redirect_uri: 'http://localhost:4200/login-completed'//'https://link-lives.dk/find-livsforloeb-testversion/login-completed',// window.location.href
    })
  }

  currentPath() {
    let path = window.location.pathname.replace('find-livsforloeb-testversion/', ''); // staging / test
    path.replace('soeg-i-livsforloeb-og-kilder/', ''); // production
    return path;
  }

  currentTarget() {
    if(window.location.pathname.includes('find-livsforloeb-testversion/')) {
      return 'find-livsforloeb-testversion/login-completed';
    }
    if(window.location.pathname.includes('soeg-i-livsforloeb-og-kilder/')) {
      return 'soeg-i-livsforloeb-og-kilder/login-completed';
    }
    return 'login-completed';
  }
}
