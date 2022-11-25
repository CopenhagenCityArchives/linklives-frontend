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

  sendDownloadRequest(fileType: any, sourceType: string, sourceId?: string, query?: string) {
    const sourceTypeApiMap = {
      person_appearance: "PersonAppearance",
      life_course: "LifeCourse",
      search_data: "SearchQuery",
    }

    const url = `${environment.apiUrl}/${sourceTypeApiMap[sourceType]}/${sourceId}/download.${fileType}`
    const options = { responseType: 'text' as const };
    return this.http.post(url, "", options);
  }

  getDownloadData(fileType: any, sourceId: string) {
    return this.http.post(`${environment.apiUrl}/PersonAppearance/${sourceId}/download.${fileType}`,"", {responseType: 'text'})
      .pipe(
        tap(
        {
          next: (data) => console.log(sourceId, data),
          error: (error) => console.error(sourceId, error)
        }
        )
      );
  }
}
