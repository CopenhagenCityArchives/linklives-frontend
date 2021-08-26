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
    const lifecourseKey = route.params.key;
    const currentLinkKey = route.queryParamMap.get('currentLinkKey') || '';
    const chosenRatingId = route.queryParamMap.get('chosenRatingId') || '';

    return new Observable(
      observer => {
        this.elasticsearch.getLifecourse(lifecourseKey)
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
              personAppearances: lifecourse.personAppearances,
              links: lifecourse.links,
              currentLinkKey,
              chosenRatingId,
            };
          }
          ))
          .subscribe(next => {
            observer.next(next);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }
}
