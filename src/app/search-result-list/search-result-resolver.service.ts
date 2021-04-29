import { Injectable } from '@angular/core';
import { AdvancedSearchQuery, SearchResult, SearchService, SourceIdentifier } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';

@Injectable({
  providedIn: 'root'
})
export class SearchResultResolverService implements Resolve<SearchResult> {

  constructor(private service: SearchService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<SearchResult> | Observable<never> {

    let page: number = Number(route.queryParamMap.get('pg'))
    if (page < 1 || page == NaN) {
      page = 1;
    }

    let size: number = Number(route.queryParamMap.get('size'));
    if (size < 1 || page == NaN) {
      size = 10;
    }

    let mode: string = route.queryParamMap.get('mode') || 'default';
    let sortBy: string = route.queryParamMap.get('sortBy') || "relevance";
    let sortOrder: "asc" | "desc" = route.queryParamMap.get('sortOrder') === "desc" ? "desc" : "asc";
    const sourceFilterRaw = route.queryParamMap.get("sourceFilter");

    let sourceFilter: SourceIdentifier[] = [];
    if(sourceFilterRaw) {
      sourceFilter = sourceFilterRaw
        .split(",")
        .filter(x => x)
        .map((id) => {
          const [ event_type, event_type_display, source_year_display ] = id.split("_");
          return {
            event_type,
            event_type_display,
            source_year_display,
          };
        });
    }

    let index: string[] = route.queryParamMap.get("index")?.split(",") ?? [];

    const possibleSearchQueryParams = [
      "query",
      "firstName",
      "lastName",
      "birthName",
      "birthPlace",
      "sourcePlace",
      //"deathPlace",
      //"birthYear",
      "sourceYear",
      "deathYear",
      "id",
      "lifeCourseId",
      //"maritalStatus",
    ];

    const actualSearchTerms: AdvancedSearchQuery = {};

    possibleSearchQueryParams.forEach((param) => {
      const value = route.queryParamMap.get(param);

      if(value) {
        actualSearchTerms[param] = value;
      }
    });

    addSearchHistoryEntry({
      type: SearchHistoryEntryType.SearchResult,
      query: actualSearchTerms,
      sourceFilter,
      index,
      pagination: { page, size },
      sort: { sortBy, sortOrder },
      mode,
    });

    return this.service.advancedSearch(actualSearchTerms, index, (page - 1) * size, size, sortBy, sortOrder, sourceFilter, mode);
  }
}
