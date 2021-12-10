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
    return new Promise((resolve) => this.auth.user$.subscribe(resolve));
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
