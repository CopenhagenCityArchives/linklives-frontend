import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})

export class DownloadService {
  constructor(private http: HttpClient) {}

  sendDownloadRequest(fileType: any, data: any, sourceId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/PersonAppearance/${sourceId}/download.${fileType}`,
      { responseType: 'text' },
      data
    );
  }

  getDownloadData(fileType: any, sourceId: string): Observable<string> {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.http.post<string>(`${environment.apiUrl}/PersonAppearance/${sourceId}/download.${fileType}`, {responseType: 'text'})
      .pipe(
        tap( // Log the result or error
        {
          next: (data) => console.log(sourceId, data),
          error: (error) => console.error(sourceId, error)
        }
        )
      );
  }
}
