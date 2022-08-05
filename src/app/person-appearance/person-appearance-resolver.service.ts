import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PersonAppearance, PersonAppearanceHit } from '../data/data.service';
import { map, mergeMap } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';
import { Observable } from 'rxjs';

interface PersonAppearanceResolverResult {
  pa:PersonAppearance,
  hh?:PersonAppearance[]
}

@Injectable({
  providedIn: 'root'
})
export class PersonAppearanceResolverService implements Resolve<PersonAppearanceResolverResult> {

  constructor(private elasticsearch: DataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PersonAppearanceResolverResult> {
    return this.elasticsearch.getPersonAppearance(route.params.id)
    .pipe(map(pa => pa as PersonAppearance))
    .pipe(
      mergeMap((pa, index) => {
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Census,
          personAppearance: pa,
        });

        if(!pa.pa_grouping_id_wp4) {
          return new Observable<PersonAppearanceResolverResult>(observer => {
            observer.next({
              pa,
              hh: null
            });
            observer.complete();
          });
        }

        const matchList: Object[] = [
          { "match": { "source_id": pa.source_id } },
          { "match": { "pa_grouping_id_wp4": pa.pa_grouping_id_wp4 } },
        ];

        let body = {
          "from": 0,
          "size": 100,
          "query": {
            "bool" : {
              "must": matchList,
            },
          },
        };

        return this.elasticsearch.search(['pas'], body).pipe(
          map((searchResult, index) => {
            return {
              pa,
              hh: (searchResult.hits as PersonAppearanceHit[]).map(paHit => paHit.pa)
            };
          })
        );
      })
    );
  }
  
}