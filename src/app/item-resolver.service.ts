import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { PersonAppearance, PersonAppearanceHit } from './search/search.service';
import { of, Observable } from 'rxjs';
import { flatMap, map, concatAll, mergeMap } from 'rxjs/operators';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<PersonAppearance | PersonAppearance[] | {pa:PersonAppearance, hh:PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let personAppearances: Observable<PersonAppearance | PersonAppearance[]>;
    if (history.state?.data) {
      personAppearances = of(history.state.data);
    } else {
      personAppearances = this.elasticsearch.getDocument(route.data['index'], route.params['id']);
    }

    // enrich with household if getting pa
    if (route.data['index'] == 'pas') {
      return personAppearances.pipe(
        mergeMap((pa: PersonAppearance, index) => {
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
                          "should": [
                            { "match": { "person_appearance.hh_id": pa.hh_id } }
                          ]
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
                pa: pa,
                hh: (searchResult.hits as PersonAppearanceHit[]).map(paHit => paHit.pa)
              };
            })
          );
        })
      );
    } else {
      return personAppearances;
    }
  }
  
}