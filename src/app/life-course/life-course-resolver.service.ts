import { Injectable } from '@angular/core';
import { PersonAppearance } from '../search/search.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable({
  providedIn: 'root'
})
export class LifeCourseResolverService implements Resolve<{lifecourseId:number, personAppearances: PersonAppearance[]}> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ lifecourseId: number; personAppearances: PersonAppearance[]; }> {
    if (history.state?.data) {
      return of({ lifecourseId: route.params['id'], personAppearances: history.state.data });
    } else {
      return this.elasticsearch.getDocument('lifecourses', route.params['id']).pipe(map(pas => { 
        return { lifecourseId: 1, personAppearances: pas as PersonAppearance[] }
       }));
    }
  }
}
