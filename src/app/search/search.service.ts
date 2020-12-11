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
  hits: SearchHit[],
  meta: {
    possibleSources: Array<{ source_year: number, event_type: string }>,
  }
}

export interface PersonAppearance {
  address: string,
  age: string,
  age_clean: number,
  all_possible_family_names: string,
  all_possible_patronyms: string,
  birth_place: string,
  birth_place_clean: string,
  birth_place_county: string,
  birth_place_county_std: string,
  birth_place_district: string,
  birth_place_island: string,
  birth_place_koebstad: string,
  birth_place_koebstad_std: string,
  birth_place_other: string,
  birth_place_parish: string,
  birth_place_parish_std: string,
  birth_place_place: string,
  birth_place_town: string,
  birth_year: string,
  county: string,
  dateOfDeath: string,
  district: string,
  event_type: string,
  family_names: string,
  first_names: string[],
  first_names_clean: string,
  full_address: string,
  gender: string,
  gender_clean: string,
  gender_std: string,
  hh_id: number,
  household_family_no: string,
  household_position: string,
  household_position_std: string,
  id: string,
  land_register: string,
  land_register_address: string,
  lastname_clean: string,
  last_updated: string,
  maiden_family_names: string,
  maiden_patronyms: string,
  marital_status: string,
  marital_status_clean: string,
  marital_status_std: string,
  name: string,
  name_clean: string,
  name_std: string,
  occupation: string,
  pa_id: number,
  pa_entry_permalink: string,
  parish: string,
  parish_type: string,
  patronyms: string[],
  place_name: string,
  positions: string,
  role: string,
  source_id: number,
  source_reference: string,
  source_year: number,
  state_region: string,
  transcriber_comments: string,
  transcription_code: string,
  transcription_id: number,
  uncat_names: string
}

export interface Source {
  id: string,
  source_id: number,
  year: number,
  type: string,
  description: string,
  link: string,
  institution: string,
};

export interface AdvancedSearchQuery {
  query?: string,
  firstName?: string,
  lastName?: string,
  parish?: string,
  county?: string,
  birthPlace?: string,
  maritalStatus?: string,
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private elasticsearch: ElasticsearchService) { }

  advancedSearch(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string, sourceFilter: number[]): Observable<SearchResult> {
    return this.elasticsearch.searchAdvanced(query, indices, from, size, sortBy, sortOrder, sourceFilter);
  }
}
