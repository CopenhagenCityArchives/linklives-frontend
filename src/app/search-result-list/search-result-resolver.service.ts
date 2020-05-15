import { Injectable } from '@angular/core';
import { SearchResult, SearchService } from '../search/search.service';
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

    let page: number = Number(route.paramMap.get('page'))
    if (page < 1 || page == NaN) {
      page = 1;
    }

    let size: number = Number(route.paramMap.get('size'));
    if (size < 1 || page == NaN) {
      size = 10;
    }

    let index: string[] = route.queryParamMap.get("index")?.split(",") ?? ["lifecourses", "pas"];
    let query: string = route.queryParamMap.get("query");

    if (query === null) {
      return EMPTY;
    } else {
      return this.service.simpleSearch(query, index, (page - 1) * size, size);
    }
  }
}
