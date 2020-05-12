import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { PersonalAppearanceComponent } from '../personal-appearance/personal-appearance.component';

export type SearchHit = PersonAppearanceHit | LinkHit | LifecourseHit;

export interface PersonAppearanceHit {
  type: "pas",
  pa: PersonAppearance
}

export interface LinkHit {
  type: "links",
  link_id: number,
  life_course_ids: number[],
  pas: [PersonAppearance, PersonAppearance]
}

export interface LifecourseHit {
  type: "lifecourses",
  life_course_id: number,
  pas: PersonAppearance[]
}

export interface SearchResult {
  took: number,
  totalHits: number,
  indexHits: {
    lifeCourses?: number,
    pas?: number,
    links?: number
  },
  hits: SearchHit[]
}

export interface PersonAppearance {
  pa_id: number,
  source_id: number,
  løbenr_i_indtastning: number, 
  Stednavn: string, 
  name: string, 
  age: number, 
  Erhverv: string, 
  Stilling_i_husstanden: string, 
  birth_place: string, 
  gender: string, 
  Sogn: string, 
  Amt: string, 
  Herred: string, 
  gender_clean: string, 
  name_clean: string, 
  age_clean: number, 
  hh_id: number, 
  hh_pos_std: string, 
  is_husband: boolean, 
  has_husband: boolean, 
  name_std: string, 
  maiden_family_names: string, 
  maiden_patronyms: string, 
  first_names: string, 
  patronyms: string, 
  family_names: string, 
  uncat_names: string, 
  husband_first_names: string, 
  husband_name_match: boolean, 
  true_patronym: string, 
  all_possible_patronyms: string, 
  all_possible_family_names: string, 
  b_place_cl: string, 
  other_cl: string, 
  parish_cl: string, 
  district_cl: string, 
  county_cl: string, 
  koebstad_cl: string, 
  island_cl: string, 
  town_cl: string, 
  place_cl: string, 
  county_std: string, 
  parish_std: string, 
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private elasticsearch: ElasticsearchService) { }

  getTypes() : Observable<{ id: number, name: string, description: string }> {
    var observable = new Observable<{ id: number, name: string, description: string }>(subscriber => {
      subscriber.next({ id: 1, name: "Navn", description: "En persons navn" });
      subscriber.next({ id: 2, name: "Sted", description: "En persons sted" });
      subscriber.next({ id: 3, name: "År", description: "En persons år" });
      subscriber.complete();
    });

    return observable;
  }

  simpleSearch(query: string, indices: string[], from: number, size: number): Observable<SearchResult> {
    return this.elasticsearch.searchSimple(query, indices, from, size);
  }
}
