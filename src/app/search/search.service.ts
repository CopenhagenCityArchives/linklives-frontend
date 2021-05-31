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
    possibleFilters: {
      eventType: Array<{ event_type: string, event_type_display: string, count: number }>,
      source: Array<{ source_type_wp4: string, source_type_display: string, count: number }>
    },
  }
}

export interface PersonAppearance {
  address: string,
  age: string,
  age_clean: number,
  all_possible_family_names: string,
  all_possible_patronyms: string,
  birthplace_display: string,
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
  birthyear_display: string,
  birthyear_calculated_display: string,
  county: string,
  dateOfDeath: string,
  deathyear_display: string,
  district: string,
  event_id: number,
  event_persons: number,
  event_type: string,
  event_type_display: string,
  event_year: string,
  event_year_display: string,
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
  last_updated_wp4: string,
  maiden_family_names: string,
  maiden_patronyms: string,
  marital_status: string,
  marital_status_clean: string,
  marital_status_std: string,
  name: string,
  name_display: string,
  name_clean: string,
  name_std: string,
  occupation: string,
  occupation_display: string,
  pa_id: number,
  pa_entry_permalink_wp4: string,
  parish: string,
  parish_type: string,
  patronyms: string[],
  place_name: string,
  positions: string,
  role: string,
  role_display: string,
  source_archive_display: string,
  source_id: number,
  source_reference: string,
  source_type_display: string,
  source_type_wp4: string,
  source_year: number,
  source_year_display: string,
  sourceplace_display: string,
  state_region: string,
  transcriber_comments: string,
  transcription_code: string,
  transcription_id: number,
  uncat_names: string
}

export interface Lifecourse {
  life_course_id: number,
  person_appearance: PersonAppearance[]
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
export interface EventTypeFilterIdentifier {
  filter_type: string,
  event_type: string,
  event_type_display: string,
};

export interface SourceFilterIdentifier {
  filter_type: string,
  source_type_wp4: string,
  source_type_display: string,
};

export type FilterIdentifier = EventTypeFilterIdentifier | SourceFilterIdentifier;
export interface AdvancedSearchQuery {
  query?: string,
  name?: string,
  firstName?: string,
  lastName?: string,
  birthName?: string,
  birthPlace?: string,
  sourcePlace?: string,
  sourceYear?: string,
  deathYear?: string,
  id?: string,
  gender?: string,
  lifeCourseId?: string,
  // maritalStatus?: string,
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private elasticsearch: ElasticsearchService) { }

  advancedSearch(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string, sourceFilter: FilterIdentifier[], mode: string = "default"): Observable<SearchResult> {
    return this.elasticsearch.searchAdvanced(query, indices, from, size, sortBy, sortOrder, sourceFilter, mode);
  }
}
