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

    let index: string[] = route.queryParamMap.get("index")?.split(",") ?? ["lifecourses", "pas"];

    let firstName: string = route.queryParamMap.get("firstName");
    let lastName: string = route.queryParamMap.get("lastName");
    let parish: string = route.queryParamMap.get("parish");
    let birthPlace: string = route.queryParamMap.get("birthPlace");

    if(firstName || lastName || parish || birthPlace) {
      return this.service.advancedSearch({
        firstName,
        lastName,
        parish,
        birthPlace,
      }, index, (page - 1) * size, size);
    }

    let query: string = route.queryParamMap.get("query");

    if (query !== null) {
      return this.service.simpleSearch(query, index, (page - 1) * size, size);
    }
    return this.service.simpleSearch("", index, (page - 1) * size, size);
  }
}
