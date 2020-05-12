import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { PersonAppearance } from './search/search.service';
import { of } from 'rxjs';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<PersonAppearance | PersonAppearance[]> {

  constructor(private elasticsearch: ElasticsearchService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (history.state.data) {
      return of(history.state.data);
    } else {
      return this.elasticsearch.getDocument(route.data['index'], route.params['id']);
    }
  }
  
}