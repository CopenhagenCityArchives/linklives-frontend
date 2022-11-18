import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})

export class DownloadService {
  constructor(private http: HttpClient) {}

  sendDownloadRequest(fileType: any, data: any, sourceId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/personappearance/${sourceId}/download.${fileType}`, data);
  }
}
