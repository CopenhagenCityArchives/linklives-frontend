import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AdvancedSearchQuery, DataService, FilterIdentifier } from "./data.service";
import { tap } from "rxjs/operators";

const sourceTypeApiMap = {
  person_appearance: "PersonAppearance/v2",
  life_course: "LifeCourse",
}

export interface SearchQuery {
  query: AdvancedSearchQuery,
  sourceFilter: FilterIdentifier[],
  indexKeys: string[],
  mode: string,
  sortBy: string,
  sortOrder: string,
  excludeDubiousLinks?: boolean,
  excludeUndoubtedLinks?: boolean,
};

@Injectable({
  providedIn: "root"
})
export class DownloadService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  loadingEmitter = new EventEmitter<boolean>();

  sendDownloadRequest(fileType: any, sourceType: string, sourceId?: string, query?: SearchQuery, sourceDownloadLimit?: number) {
    this.loadingEmitter.emit(true);
    if(sourceType == "search_data") {
      const queryBody = this.dataService.buildEsQuery(
        query.query,
        query.indexKeys,
        0,
        sourceDownloadLimit,
        query.sortBy,
        query.sortOrder,
        query.sourceFilter,
        query.mode,
        query.excludeDubiousLinks,
        query.excludeUndoubtedLinks,
      );
      return this.http.post(`${environment.apiUrl}/search/${query.indexKeys.join(",")}/download.${fileType}`, queryBody, {
        observe: "response",
        responseType: 'arraybuffer',
      }).pipe(tap(() => this.loadingEmitter.emit(false)));
    }

    return this.http.post(`${environment.apiUrl}/${sourceTypeApiMap[sourceType]}/${sourceId}/download.${fileType}`, "", {
      observe: "response",
      responseType: 'arraybuffer',
    }).pipe(tap(() => this.loadingEmitter.emit(false)));
  }
}
