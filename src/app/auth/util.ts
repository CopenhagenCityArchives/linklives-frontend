import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthUtil {
  constructor(public auth: AuthService) { }

  handleLogin() {
    const path = this.currentPath();
    const redirect_uri = `${this.baseUrl()}`;
    const onLoginCompleted = {
      path,
    };
  
    if(window.location.search.length > 1) {
      onLoginCompleted['query'] = window.location.search.substring(1);
    }
    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));
    console.log('redirect url', redirect_uri);
    this.auth.loginWithRedirect({
      redirect_uri,
      appState: { target: 'login-completed' }
    })
  }

  handleLogout() {
    this.auth.logout({ returnTo: this.baseUrl() });
  }

  currentPath() {
    let path = window.location.pathname.replace('find-livsforloeb-testversion/', ''); // staging / test
    path.replace('soeg-i-livsforloeb-og-kilder/', ''); // production
    return path;
  }

  baseUrl() {
    if(window.location.pathname.includes('find-livsforloeb-testversion/')) {
      return 'https://link-lives.dk/find-livsforloeb-testversion';
    }
    if(window.location.pathname.includes('soeg-i-livsforloeb-og-kilder/')) {
      return 'https://link-lives.dk/soeg-i-livsforloeb-og-kilder';
    }
    return 'http://localhost:4200';
  }
}
