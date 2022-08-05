import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DataService, EventLookupKeys, EventType, EventTypeBucket, Link, SimpleBucket, SourceBucket, SourceLookupKeys } from '../data/data.service';

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
  life_course_key: string,
  pas: PersonAppearance[]
}

export interface EntryCounts {
  totalHits: number,
  indexHits: {
    lifeCourses?: number,
    pas?: number,
    links?: number
  },
}

export type SearchResult = EntryCounts & {
  took: number,
  hits: SearchHit[],
  meta: {
    possibleFilters: {
      eventType: Array<EventTypeBucket>,
      source: Array<SourceBucket>
      eventYear: Array<SimpleBucket>,
      birthYear: Array<SimpleBucket>,
      deathYear: Array<SimpleBucket>,
    },
  }
}

export interface PersonAppearance {
  birthplace_display: string,
  birthyear_display: string,
  deathyear_display: string,
  event_type_display: string,
  event_year_display: string,
  key: string,
  last_updated_wp4: string,
  name_display: string,
  occupation_display: string,
  occupation_searchable: string,
  pa_entry_permalink_wp4: string,
  pa_grouping_id_wp4: string,
  pa_grouping_id_wp4_sortable: string,
  role_display: string,
  role_searchable: string,
  source_archive_display: string,
  source_id: number,
  source_type_display: string,
  source_type_wp4: string,
  sourceyear_display: string,
  sourceyear_searchable: string,
  sourceplace_display: string,
  standard: {
    event_type: EventType,
  },
  transcribed: {
    transcription: Object,
  },
}

export interface Lifecourse {
  key: string, // actual identifier
  life_course_id: number,
  personAppearances: PersonAppearance[]
  links: Link[],
  data_version: string,
  is_historic: boolean,
}

interface HasFilterType {
  filter_type: string,
}

export type EventTypeFilterIdentifier = EventLookupKeys & HasFilterType;
export type SourceFilterIdentifier = SourceLookupKeys & HasFilterType;
export type HistogramFilterIdentifier = { value: number } & HasFilterType;

export type FilterIdentifier = EventTypeFilterIdentifier | SourceFilterIdentifier | HistogramFilterIdentifier;
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
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private elasticsearch: DataService) { }

  advancedSearch(
    query: AdvancedSearchQuery,
    indices: string[],
    from: number,
    size: number,
    sortBy: string,
    sortOrder: string,
    sourceFilter: FilterIdentifier[],
    mode: string = "default",
    excludeDubiousLinksString: string = "false",
    excludeUndoubtedLinksString: string = "false",
  ): Observable<SearchResult> {
    const excludeDubiousLinks = excludeDubiousLinksString === "true";
    const excludeUndoubtedLinks = excludeUndoubtedLinksString === "true";
    return this.elasticsearch.searchAdvanced(
      query,
      indices,
      from,
      size,
      sortBy,
      sortOrder,
      sourceFilter,
      mode,
      excludeDubiousLinks,
      excludeUndoubtedLinks,
    );
  }
}
