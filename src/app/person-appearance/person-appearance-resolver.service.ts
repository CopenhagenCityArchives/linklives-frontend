import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PersonAppearance, PersonAppearanceHit, Source } from '../search/search.service';
import { map, mergeMap } from 'rxjs/operators';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
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

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PersonAppearanceResolverResult> {
    return this.elasticsearch.getPersonAppearance(route.params['id'])
    .pipe(map(pa => pa as PersonAppearance))
    .pipe(
      mergeMap((pa, index) => {
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Census,
          personAppearance: pa,
        });

        if(!pa.hh_id && (!pa.event_id || pa.event_persons < 2)) {
          return new Observable<PersonAppearanceResolverResult>(observer => {
            observer.next({
              pa,
              hh: null
            });
            observer.complete();
          });
        }

        const matchList: Object[] = [
          { "match": { "person_appearance.source_id": pa.source_id } },
        ];

        // we will only have either hh_id OR event_id
        if(pa.hh_id) {
          matchList.push(
            { "match": { "person_appearance.hh_id": pa.hh_id } },
          )
        }
        if(pa.event_id) {
          matchList.push(
            { "match": { "person_appearance.event_id": pa.event_id } },
          )
        }

        let body = {
          "from": 0,
          "size": 100,
          "query": {
            "bool": {
              "must": [
                {
                  "nested": {
                    "path": "person_appearance",
                    "query": {
                      "bool" : {
                        "must": matchList
                      }
                    }
                  }
                }
              ]
            }
          }
        }

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