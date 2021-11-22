import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface SourceCounts {
  personAppearanceCount: number,
  lifecourseCount: number,
}

@Injectable({
  providedIn: 'root'
})
export class SearchSimpleResolverService implements Resolve<SourceCounts> {

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SourceCounts> {
    return this.http.get<any>(`${environment.apiUrl}/stats`)
      .pipe(map((result) => {
        return {
          personAppearanceCount: result.esPersonAppearanceCount,
          lifecourseCount: result.esLifecourseCount,
        };
      }));
  }
}
