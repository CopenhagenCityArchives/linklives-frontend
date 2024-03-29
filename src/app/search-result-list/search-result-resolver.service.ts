import { Injectable } from '@angular/core';
import { AdvancedSearchQuery, SearchResult, DataService, FilterIdentifier } from '../data/data.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';
import { EventType } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SearchResultResolverService implements Resolve<SearchResult> {

  constructor(private service: DataService) { }
  resolve(
    route: ActivatedRouteSnapshot,
  ) : Observable<SearchResult> | Observable<never> {

    let page: number = Number(route.queryParamMap.get('pg'))
    if (page < 1 || Number.isNaN(page)) {
      page = 1;
    }

    let size: number = Number(route.queryParamMap.get('size'));
    if (size < 1 || Number.isNaN(page)) {
      size = 10;
    }

    let mode: string = route.queryParamMap.get('mode') || 'default';
    let excludeDubiousLinks: string = route.queryParamMap.get('excludeDubiousLinks') || "false";
    let excludeUndoubtedLinks: string = route.queryParamMap.get('excludeUndoubtedLinks') || "false";
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
            const [ _, filter_type, event_type, event_type_display ] = id.match(/^([^_]+)_(.+)_([^_]+)$/);
            return {
              filter_type,
              event_type: event_type as EventType,
              event_type_display,
            };
          }
          if(filter_type == 'source') {
            const [ _, filter_type, source_type_wp4, source_type_display ] = id.match(/^([^_]+)_(.+)_([^_]+)$/);
            return {
              filter_type,
              source_type_wp4,
              source_type_display,
            };
          }

          const isHistogramFilter = (filter_type) => [
            'birthYear',
            'sourceYear',
            'deathYear',
            'eventYear',
          ].includes(filter_type);

          if(isHistogramFilter(filter_type)) {
            const [ filter_type, value ] = id.split("_");
            return {
              filter_type,
              value: parseInt(value),
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
      "deathPlace",
      "birthYear",
      "sourceYear",
      "deathYear",
      "id",
      "lifeCourseId",
      "gender",
      "occupation",
      "role",
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
      excludeDubiousLinks,
      excludeUndoubtedLinks,
    });

    return this.service.searchAdvanced(
      actualSearchTerms,
      index,
      (page - 1) * size,
      size,
      sortBy,
      sortOrder,
      sourceFilter,
      mode,
      excludeDubiousLinks === "true",
      excludeUndoubtedLinks === "true",
    );
  }
}
