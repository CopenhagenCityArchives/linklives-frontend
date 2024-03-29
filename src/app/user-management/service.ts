import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService, User } from "@auth0/auth0-angular";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private http: HttpClient, private auth: AuthService) { }

  async updateProfile(data) {
    const user = await this.getUser();
    const observable = this.http.put<any>(`${environment.apiUrl}/manage/User/${user.sub}`, data);
    return await this.promisifyObservable(observable);
  }

  private promisifyObservable<T>(observable: Observable<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let value: T;

      observable.subscribe({
        error(e) {
          reject(e);
        },
        next(v) {
          value = v;
        },
        complete() {
          resolve(value);
        },
      });
    })
  }

  getUser(): Promise<User> {
    return new Promise((resolve, reject) => this.auth.user$.subscribe({
      next: (user) => {
        if(!user && localStorage.getItem('lls__isLoggedIn')) {
          this.handleLogin();
          return;
        }
        resolve(user);
      },
      error: reject,
    }));
  }

  async getProfile() {
    const user = await this.getUser();
    const observable = this.http.get<any>(`${environment.apiUrl}/manage/User/${user.sub}`);
    const profile = await this.promisifyObservable(observable);
    return { ...user, ...profile };
  }

  deleteProfile() {
    const observable = this.http.delete<any>(`${environment.apiUrl}/manage/User`);
    return this.promisifyObservable(observable);
  }

  handleLogin() {
    const path = this.currentPath();
    const onLoginCompleted: { path: string, query?: string } = { path };

    if(window.location.search.length > 1) {
      onLoginCompleted.query = window.location.search.substring(1);
    }

    localStorage.setItem('onLoginCompleted', JSON.stringify(onLoginCompleted));

    this.auth.loginWithRedirect({
      redirect_uri: UserManagementService.baseUrl,
      appState: { target: 'login-completed' }
    });
  }

  handleLogout() {
    const onLoginChanged = (window as any).lls__onLoginChanged;
    if(onLoginChanged) {
      onLoginChanged(false);
    }
    else {
      console.warn("No `onLoginChanged` listener present on `window` while logging out.");
    }
    this.auth.logout({ returnTo: UserManagementService.baseUrl });
  }

  currentPath() {
    if(!environment.pathPrefix.length) {
      return window.location.pathname;
    }
    return window.location.pathname.replace(environment.pathPrefix, '');
  }

  static get baseUrl() {
    return `${window.location.protocol}//${window.location.host}${environment.pathPrefix}`;
  }
}
