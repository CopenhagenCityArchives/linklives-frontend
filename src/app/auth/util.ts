import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthUtil {
  constructor(public auth: AuthService) { }

  handleLogin() {
    const path = this.currentPath();
    const redirect_uri = this.baseUrl();
    const onLoginCompleted: { path: string, query?: string } = {
      path,
    };
  
    if(window.location.search.length > 1) {
      onLoginCompleted.query = window.location.search.substring(1);
    }
    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));
    this.auth.loginWithRedirect({
      redirect_uri,
      appState: { target: 'login-completed' }
    })
  }

  handleLogout() {
    this.auth.logout({ returnTo: this.baseUrl() });
  }

  currentPath() {
    if(!environment.pathPrefix.length) {
      return window.location.pathname;
    }
    return window.location.pathname.replace(environment.pathPrefix, '');
  }

  baseUrl() {
    return `${window.location.protocol}//${window.location.host}${environment.pathPrefix}`;
  }
}
