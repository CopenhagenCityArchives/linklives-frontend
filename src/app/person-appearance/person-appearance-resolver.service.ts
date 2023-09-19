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
    .pipe(map((result) => {
      const pa = result.personAppearance as PersonAppearance;

      addSearchHistoryEntry({
        type: SearchHistoryEntryType.Census,
        personAppearance: pa,
      });

      return {
        pa: pa,
        hh: result.relatedPersonAppearances as PersonAppearance[],
      };
    }));
  }
  
}