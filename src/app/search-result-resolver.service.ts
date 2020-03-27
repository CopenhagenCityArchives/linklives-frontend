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
    if (route.queryParamMap.has("query")) {
      return this.service.simpleSearch(route.queryParamMap.get("query"), 1, 10);
    } else {
      return EMPTY;
    }
  }
}
