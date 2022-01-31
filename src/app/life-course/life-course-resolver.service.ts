import { Injectable } from '@angular/core';
import { Lifecourse, PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { DataService, Link } from '../data/data.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseKey: string, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: DataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseKey: string; personAppearances: PersonAppearance[]; links: Link[]; currentLinkId: string; chosenRatingId: string; lifecourseId: number; }> {
    const lifecourseKey = route.params.key;
    const currentLinkId = route.queryParamMap.get('currentLinkId') || '';
    const chosenRatingId = route.queryParamMap.get('chosenRatingId') || '';

    return this.elasticsearch.getLifecourse(lifecourseKey)
      .pipe(map((lifecourse: Lifecourse, index) => {
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Lifecourse,
          lifecourse: {
            key: lifecourseKey,
            personAppearances: lifecourse.personAppearances || [],
          },
        });
        return {
          lifecourseKey,
          lifecourseId: lifecourse.life_course_id,
          personAppearances: lifecourse.personAppearances,
          links: lifecourse.links,
          currentLinkId,
          chosenRatingId,
          data_version: lifecourse.data_version,
        };
      }));
  }
}
