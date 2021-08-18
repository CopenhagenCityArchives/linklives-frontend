import { Injectable } from '@angular/core';
import { AdvancedSearchQuery, SearchResult, SearchService, FilterIdentifier } from '../search/search.service';
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

    let sourceFilter: FilterIdentifier[] = [];
    if(sourceFilterRaw) {
      sourceFilter = sourceFilterRaw
        .split(",")
        .filter(x => x)
        .map((id) => {
          const filter_type = id.split("_")[0];
          if(filter_type == 'eventType') {
            const [ filter_type, event_type, event_type_display ] = id.split("_");
            return {
              filter_type,
              event_type,
              event_type_display,
            };
          }
          if(filter_type == 'source') {
            const [ filter_type, source_type_wp4, source_type_display ] = id.split("_");
            return {
              filter_type,
              source_type_wp4,
              source_type_display,
            };
          }
          if(filter_type == 'eventYear') {
            const [ filter_type, event_year_display ] = id.split("_");
            return {
              filter_type,
              //event_year,
              event_year_display,
            };
          }

          if(filter_type == 'sourceYear') {
            const [ filter_type, source_year_searchable, source_year_display ] = id.split("_");
            return {
              filter_type,
              source_year_searchable,
              source_year_display,
            };
          }

          if(filter_type == 'birthYear') {
            const [ filter_type, birthyear_searchable, birthyear_display ] = id.split("_");
            return {
              filter_type,
              birthyear_searchable,
              birthyear_display,
            };
          }

          if(filter_type == 'deathYear') {
            const [ filter_type, deathyear_searchable, deathyear_display ] = id.split("_");
            return {
              filter_type,
              deathyear_searchable,
              deathyear_display,
            };
          }
        });
    }

    let index: string[] = route.queryParamMap.get("index")?.split(",") ?? [];

    const possibleSearchQueryParams = [
      "query",
      "name",
      "firstName",
      "lastName",
      "birthName",
      "birthPlace",
      "sourcePlace",
      //"deathPlace",
      "birthYear",
      "sourceYear",
      "deathYear",
      "id",
      "lifeCourseId",
      "gender",
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
      filters: sourceFilter,
      index,
      pagination: { page, size },
      sort: { sortBy, sortOrder },
      mode,
    });

    return this.service.advancedSearch(actualSearchTerms, index, (page - 1) * size, size, sortBy, sortOrder, sourceFilter, mode);
  }
}
