import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PersonalAppearance } from './search/search.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<PersonalAppearance | PersonalAppearance[]> {

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (history.state.data) {
      return of(history.state.data);
    } else {
      return this.http.get(`${environment.apiUrl}/${route.data['index']}/_doc/${route.data['']}`).pipe(
        map((item: any) => { console.log(item); item._source.personal_appearance as PersonalAppearance[] })
      );
    }
  }
}
