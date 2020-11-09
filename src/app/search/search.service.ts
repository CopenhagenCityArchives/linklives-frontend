import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

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
  source_year: number, 
  løbenr_i_indtastning: number, 
  Stednavn: string, 
  name: string, 
  age: number, 
  Erhverv: string, 
  household_position_std: string, 
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
  county: string, 
  parish: string, 
  parish_type: string, 
  district: string, 
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private elasticsearch: ElasticsearchService) { }

  simpleSearch(query: string, indices: string[], from: number, size: number): Observable<SearchResult> {
    return this.elasticsearch.searchSimple(query, indices, from, size);
  }

  advancedSearch(query: Object, indices: string[], from: number, size: number): Observable<SearchResult> {
    return this.elasticsearch.searchAdvanced(query, indices, from, size);
  }
}
