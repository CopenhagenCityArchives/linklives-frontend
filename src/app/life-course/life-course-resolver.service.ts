import { Injectable } from '@angular/core';
import { PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ElasticsearchService, Link } from '../elasticsearch/elasticsearch.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseId:number, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseId: number; personAppearances: PersonAppearance[]; links: Link[]; }> {
    const lifecourseId = route.params['id'];

    return this.elasticsearch.getLifecourse(lifecourseId)
      .pipe(map(pas => pas as PersonAppearance[]))
      .pipe(mergeMap((pas: PersonAppearance[], index) => {
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Lifecourse,
          lifecourse: {
            id: lifecourseId,
            personAppearances: pas,
          },
        });

        return this.elasticsearch.searchLinks(pas)
          .pipe(map((linksResult, index) => {
            const paIds: string[] = pas.map((pa) => `${pa.source_id}-${pa.pa_id}`);
            const links = linksResult.filter((link) => {
              const linkStartId = `${link.source_id1}-${link.pa_id1}`;
              const linkEndId = `${link.source_id2}-${link.pa_id2}`;
              return paIds.includes(linkStartId) && paIds.includes(linkEndId);
            });

            return {
              lifecourseId,
              personAppearances: pas,
              links,
            };
          }));
      }));
  }
}
