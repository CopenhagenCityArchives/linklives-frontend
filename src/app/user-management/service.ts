import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private http: HttpClient) { }

  updateProfile(user, data) {
    return new Promise<void>((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}/manage/User/${user.sub}`, data)
        .subscribe({
          error(e) {
            reject(e);
          },
          complete() {
            resolve();
          },
        });
    });
  }
}
