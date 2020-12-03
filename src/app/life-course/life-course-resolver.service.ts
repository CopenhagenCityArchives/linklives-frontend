import { Injectable } from '@angular/core';
import { PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ElasticsearchService, Link } from '../elasticsearch/elasticsearch.service';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseId:number, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseId: number; personAppearances: PersonAppearance[]; links: Link[]; }> {
    const x = (pas) => this.elasticsearch.searchLinks(pas)
      .pipe(map((linksResult, index) => {
        return {
          lifecourseId: route.params['id'],
          personAppearances: pas as PersonAppearance[],
          links: linksResult as Link[],
        };
      }));

    return this.elasticsearch.getDocument('lifecourses', route.params['id'])
      .pipe(map(pas => pas as PersonAppearance[]))
      .pipe(mergeMap((pas: PersonAppearance[], index) => {
        return x(pas);
      }));
  }
}
