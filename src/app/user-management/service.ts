import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
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

  getUser() {
    const observable = this.auth.user$;
    return this.promisifyObservable(observable);
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
}
