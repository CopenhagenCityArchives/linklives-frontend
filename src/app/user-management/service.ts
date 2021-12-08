import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private http: HttpClient) { }

  updateProfile(user, data) {
    const observable = this.http.put<any>(`${environment.apiUrl}/manage/User/${user.sub}`, data);
    return this.promisifyObservable(observable);
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

  getProfile(user) {
    const observable = this.http.get<any>(`${environment.apiUrl}/manage/User/${user.sub}`);
    return this.promisifyObservable(observable);
  }

  deleteProfile() {
    const observable = this.http.delete<any>(`${environment.apiUrl}/manage/User`);
    return this.promisifyObservable(observable);
  }
}
