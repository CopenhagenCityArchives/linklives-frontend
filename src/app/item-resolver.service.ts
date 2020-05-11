import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { PersonalAppearance, SearchService } from './search/search.service';
import { of, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<PersonalAppearance | PersonalAppearance[]> {

  constructor(private http: HttpClient, private route: ActivatedRoute, private service: SearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    

    if (history.state.data) {
      return of(history.state.data);
    } else {
      console.log("Resolve 2");
      console.log(route);
      return this.http.get(`${environment.apiUrl}/${route.data['index']}/_doc/${route.params['id']}`);
    }
/*
    if (history.state) {
      console.log("Resolve 2");
      console.log(route);
      return this.http.get(`${environment.apiUrl}/${route.data['index']}/_doc/${route.params['id']}`);
    } else {
      console.log("Resolve 3");
      console.log(state.url);
      console.log(route);
      return this.http.get(`${environment.apiUrl}/${route.data['index']}/_doc/${route.params['id']}`)
    }*/
  }
  
}