import { Injectable } from '@angular/core';
import { AdvancedSearchQuery, SearchResult, SearchService } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchResultResolverService implements Resolve<SearchResult> {

  constructor(private service: SearchService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<SearchResult> | Observable<never> {

    let page: number = Number(route.paramMap.get('page'))
    if (page < 1 || page == NaN) {
      page = 1;
    }

    let size: number = Number(route.paramMap.get('size'));
    if (size < 1 || page == NaN) {
      size = 10;
    }

    let sortBy: string = route.queryParamMap.get('sortBy') || "random";
    let sortOrder: string = route.queryParamMap.get('sortOrder') === "desc" ? "desc" : "asc";
    const sourceFilterRaw = route.queryParamMap.get("sourceFilter");
    let sourceFilter: number[] = sourceFilterRaw ? sourceFilterRaw.split(",").filter(x => x).map((year) => parseInt(year)) : [];

    let index: string[] = route.queryParamMap.get("index")?.split(",") ?? ["lifecourses", "pas"];

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
      //"deathYear",
      //"maritalStatus",
    ];

    const actualSearchTerms: AdvancedSearchQuery = {};

    possibleSearchQueryParams.forEach((param) => {
      const value = route.queryParamMap.get(param);

      if(value) {
        actualSearchTerms[param] = value;
      }
    });

    return this.service.advancedSearch(actualSearchTerms, index, (page - 1) * size, size, sortBy, sortOrder, sourceFilter);
  }
}
