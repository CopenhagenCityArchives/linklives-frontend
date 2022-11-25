import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

const sourceTypeApiMap = {
  person_appearance: "PersonAppearance",
  life_course: "LifeCourse",
  search_data: "SearchQuery",
}

@Injectable({
  providedIn: "root"
})
export class DownloadService {
  constructor(private http: HttpClient) {}

  sendDownloadRequest(fileType: any, sourceType: string, sourceId?: string, query?: string) {
    const url = `${environment.apiUrl}/${sourceTypeApiMap[sourceType]}/${sourceId}/download.${fileType}`
    return this.http.post(url, "", {
      observe: "response",
      responseType: 'arraybuffer',
    });
  }
}
