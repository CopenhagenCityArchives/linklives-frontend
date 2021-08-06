import { Injectable } from '@angular/core';
import { Lifecourse, PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ElasticsearchService, Link } from '../elasticsearch/elasticsearch.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseKey: string, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseKey: string; personAppearances: PersonAppearance[]; links: Link[]; }> {
    console.log('route.params', route.params);
    const lifecourseKey = route.params['key'];

    return this.elasticsearch.getLifecourse(lifecourseKey)
      .pipe(mergeMap((lifecourse: Lifecourse, index) => {
        console.log('lifeCourse', lifecourse);
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Lifecourse,
          lifecourse: {
            key: lifecourseKey,
            personAppearances: lifecourse.person_appearance || [],
          },
        });

        // return this.elasticsearch.searchLinks(lifecourse.person_appearance)
        //   .pipe(map((linksResult, index) => {
        //     const paIds: string[] = lifecourse.person_appearance.map((pa) => `${pa.source_id}-${pa.pa_id}`);
        //     const links = linksResult.filter((link) => {
        //       const linkStartId = `${link.source_id1}-${link.pa_id1}`;
        //       const linkEndId = `${link.source_id2}-${link.pa_id2}`;
        //       return paIds.includes(linkStartId) && paIds.includes(linkEndId);
        //     });

            return {
              lifecourseKey,
              personAppearances: lifecourse.person_appearance,
              links,
            };
          }));
      }));
  }
}
