import { Injectable } from '@angular/core';
import { SearchResult, SearchService } from './search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchResultResolverService implements Resolve<SearchResult> {

  constructor(private service: SearchService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : Observable<SearchResult> | Observable<never> {
    let start: number = 0;
    if (route.queryParamMap.has("start")) {
      start = Number(route.queryParamMap.get("start"));
    }

    let index: string = "lifecourses,pas";
    if (route.queryParamMap.has("index")) {
      index = route.queryParamMap.get("index");
    }

    if (route.queryParamMap.has("query")) {
      return this.service.simpleSearch(route.queryParamMap.get("query"), index, start, 10);
    } else {
      return EMPTY;
    }
  }
}
