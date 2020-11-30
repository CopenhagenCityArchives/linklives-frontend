import { Injectable } from '@angular/core';
import { PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { addSearchHistoryEntry, SearchHistoryEntryType } from '../search-history';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseId:number, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseId: number; personAppearances: PersonAppearance[]; }> {
    return this.elasticsearch.getDocument('lifecourses', route.params['id']).pipe(map(pas => { 
      const lifecourse = pas as PersonAppearance[];

      addSearchHistoryEntry({
        type: SearchHistoryEntryType.Lifecourse,
        lifecourse: {
          id: route.params['id'],
          personAppearances: lifecourse,
        },
      });

      return { lifecourseId: route.params['id'], personAppearances: lifecourse }
    }));
  }
}
