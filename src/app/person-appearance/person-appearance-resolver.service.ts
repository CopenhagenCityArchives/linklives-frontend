import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PersonAppearance, PersonAppearanceHit, Source } from '../search/search.service';
import { map, mergeMap } from 'rxjs/operators';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';
import { Observable } from 'rxjs';

interface PersonAppearanceResolverResult {
  pa:PersonAppearance,
  source: Source,
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
    .pipe(mergeMap((pa: PersonAppearance, index) => {
      return this.elasticsearch.getSource(pa.source_id)
        .pipe(map((source: Source) => ({ source, pa })));
    }))
    .pipe(
      mergeMap(({ pa, source }, index) => {
        addSearchHistoryEntry({
          type: SearchHistoryEntryType.Census,
          personAppearance: pa,
        });

        if(!pa.hh_id && (!pa.event_id || pa.event_persons < 2)) {
          return new Observable<PersonAppearanceResolverResult>(observer => {
            observer.next({
              pa,
              source,
              hh: null
            });
            observer.complete();
          });
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
                        "must": [
                          { "match": { "person_appearance.hh_id": pa.hh_id } },
                          { "match": { "person_appearance.event_id": pa.event_id } },
                          { "match": { "person_appearance.source_id": pa.source_id } },
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
        // remove hh_id or event_id if they are undefined.
        // we will never have both of them set, so we will always filter out one of them.
        body.query.bool.must[0].nested.query.bool.must = body.query.bool.must[0].nested.query.bool.must
          .filter((match) => !Object.values(match.match).some(value => value == undefined));

        return this.elasticsearch.search(['pas'], body).pipe(
          map((searchResult, index) => {
            return {
              pa,
              source,
              hh: (searchResult.hits as PersonAppearanceHit[]).map(paHit => paHit.pa)
            };
          })
        );
      })
    );
  }
  
}