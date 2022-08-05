import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSearchKeys, sortValues } from 'src/app/search-term-values';
import { map, share } from 'rxjs/operators';
import groupBy from 'lodash.groupby';

export interface LifecourseSource {
  key: string,
  life_course_ids?: number[],
  person_appearance: PersonAppearance | PersonAppearance[]
}

export type PersonAppearanceSource = PersonAppearance & { key: string };

export interface ElasticSearchHit {
  _index: "lifecourses" | "pas" | "links",
  _type: string,
  _id: number,
  _score: number,
  _source: PersonAppearanceSource | LifecourseSource,
}

export interface ElasticSearchResult {
  took: number,
  timed_out: boolean,
  _shards: {
    total: number,
    successful: number,
    skipped: number,
    failed: number
  },
  hits: {
    total: {
      value: number,
      relation: string
    },
    max_score: number,
    hits: ElasticSearchHit[]
  },
  aggregations?: {
    count: {
      doc_count_error_upper_bound: number,
      sum_other_doc_count: number,
      buckets: {
        key: string,
        doc_count: number
      }[]
    },
  }
}

export interface SourceLookupKeys {
  source_type_wp4: string,
  source_type_display: string // only used for displaying
}

export type EventType = "arrival" | "babtism" | "baptism" | "burial" | "burial_protocol" | "census" | "confirmation" | "departure" | "marriage" | "spouse";

export interface EventLookupKeys {
  event_type: EventType
  event_type_display: string // only used for displaying
}

interface AggregationBucket<T> {
  key: T,
  doc_count: number,
}

interface HasCount {
  count: number
}

export type EventTypeBucket = EventLookupKeys & HasCount;
export type SourceBucket = SourceLookupKeys & HasCount;
export type SimpleBucket = { key: number } & HasCount;

export interface ElasticLookupResult {
  aggregations?: {
    eventType: { buckets: AggregationBucket<EventLookupKeys>[] },
    source: { buckets: AggregationBucket<SourceLookupKeys>[] },
    eventYear: { buckets: AggregationBucket<number>[] },
    birthYear: { buckets: AggregationBucket<number>[] },
    deathYear: { buckets: AggregationBucket<number>[] },
  },
}

export interface Link {
  pa_id1: string,
  pa_id2: string,
  source_id1: string,
  source_id2: string,
  method_id: "0"|"1"|"2",
  score: number,
  key: string,
  id: string,
  ratings: Array<object>,
  duplicates: number,
}

export interface LinksSearchResult {
  hits: {
    hits: [
      { _source: { link: Link } },
    ]
  }
}

interface EntryCountsEsResult {
  aggregations: {
    count: {
      buckets: {
        key: string,
        doc_count: number
      }[],
    },
  },
}

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
export class DataService {
  constructor(private http: HttpClient) { }

  private handleHit(elasticHit: ElasticSearchHit): SearchHit {
    if(elasticHit._index.startsWith("lifecourses")) {
      const source = elasticHit._source as LifecourseSource;

      return {
        type: "lifecourses",
        life_course_id: elasticHit._id,
        life_course_key: elasticHit._source.key,
        pas: source.person_appearance as PersonAppearance[]
      };
    }

    if(elasticHit._index.startsWith("pas")) {
      return {
        type: "pas",
        pa: elasticHit._source as PersonAppearance
      };
    }

    if(elasticHit._index.startsWith("links")) {
      const source = elasticHit._source as LifecourseSource;

      return {
        type: "links",
        link_id: elasticHit._id,
        life_course_ids: source.life_course_ids,
        pas: source.person_appearance as [PersonAppearance, PersonAppearance]
      };
    }

    throw {
      trace: new Error("Got unknown type of elasticHit (not in known index)"),
      elasticHit,
    };
  }

  private getPossibleFilters(filterLookupResult?: ElasticLookupResult) {
    const aggregations = filterLookupResult?.aggregations;

    if(!aggregations) {
      return {
        eventType: [],
        source: [],
        eventYear: [],
        birthYear: [],
        deathYear: [],
      };
    }

    const getAggregation = <T>(name) => aggregations[name] as { buckets: AggregationBucket<T>[] };

    const getComplexKeyFilter = <T>(name): (T & HasCount)[] => {
      const aggregation = getAggregation<T>(name);
      return aggregation?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [];
    };

    const getSimpleKeyFilter = (name): SimpleBucket[] => {
      const aggregation = getAggregation<number>(name);
      return aggregation?.buckets.map((bucket) => ({ key: bucket.key, count: bucket.doc_count })) ?? [];
    };

    return {
      eventType: getComplexKeyFilter<EventLookupKeys>('eventType'),
      source: getComplexKeyFilter<SourceLookupKeys>('source'),
      eventYear: getSimpleKeyFilter('eventYear'),
      birthYear: getSimpleKeyFilter('birthYear'),
      deathYear: getSimpleKeyFilter('deathYear'),
    };
  }

  private handleResult(searchResult: ElasticSearchResult, filterLookupResult?: ElasticLookupResult): SearchResult {
    const result: SearchResult = {
      took: searchResult.took,
      totalHits: 0,
      indexHits: {},
      hits: [],
      meta: {
        possibleFilters: this.getPossibleFilters(filterLookupResult),
      },
    };

    result.hits = searchResult.hits.hits.map<SearchHit>(this.handleHit);

    searchResult.aggregations?.count.buckets.forEach(value => {
      result.totalHits += value.doc_count;
      if (value.key.includes("pas")) {
        result.indexHits.pas = value.doc_count;
      }
      if (value.key.includes("lifecourses")) {
        result.indexHits.lifeCourses = value.doc_count;
      }
    });

    return result;
  }

  loading = new EventEmitter<boolean>();

  search(indices: string[], body: any, filterBody?: any): Observable<SearchResult> {
    const loadingEmitter = this.loading;
    loadingEmitter.emit(true);

    interface SearchRequests {
      search: Observable<ElasticSearchResult>,
      filterLookup?: Observable<ElasticLookupResult>,
    };
    const requests: SearchRequests = {
      search: this.http.post<ElasticSearchResult>(`${environment.esUrl}/${indices.join(',')}/_search`, body).pipe(share()),
    };

    if(filterBody) {
      requests.filterLookup = this.http.post<ElasticLookupResult>(`${environment.esUrl}/pas/_search`, filterBody).pipe(share());
    }

    // Prep observable that will send both requests and merge results in handleResult
    const observable = forkJoin(requests)
      .pipe(map(({ search, filterLookup }) => {
        loadingEmitter.emit(false);
        return this.handleResult(search, filterLookup);
      }));

    // Handle loading by listening to the observable
    observable.subscribe({
      error() {
        window.setTimeout(() => loadingEmitter.emit(false), 3000);
      },

      complete() {
        loadingEmitter.emit(false);
      }
    });

    // Return observable so the caller of this function can listen to it
    return observable;
  }

  createSortClause(sortBy: string, sortOrder: string) {
    const sortKeys = sortValues[sortBy];

    //sort: undefined should result in a JSON request with no sort field
    if(!sortKeys) {
      return undefined;
    }

    return sortKeys.map((key: string) => {
      if(key == "_score") {
        // Special case: _score is top-level, not on person_appearance
        return { _score: { order: sortOrder } };
      }

      return {
        [key]: {
          order: sortOrder,
          mode: "max",
        }
      };
    });
  }

  searchAdvanced(
    query: AdvancedSearchQuery,
    indices: string[],
    from: number,
    size: number,
    sortBy: string,
    sortOrder: string,
    sourceFilter: FilterIdentifier[],
    mode: string = "default",
    excludeDubiousLinks: boolean = false,
    excludeUndoubtedLinks: boolean = false,
  ) {
    if(indices.length < 1) {
      const emptySearchResult = new Observable<SearchResult>((observer) => {
        observer.next({
          took: 0,
          totalHits: 0,
          indexHits: {},
          hits: [],
          meta: {
            possibleFilters: {
              eventType: [],
              source: [],
              eventYear: [],
              birthYear: [],
              deathYear: [],
            }
          },
        });

        observer.complete();
      });
      return emptySearchResult;
    }

    const sort = this.createSortClause(sortBy, sortOrder);

    const { resultLookupQuery, sourceLookupQuery } = this.createQueries(query, sourceFilter, mode, excludeDubiousLinks, excludeUndoubtedLinks);

    const body = {
      from,
      size,
      indices_boost: [
        { 'lifecourses': 1.05 },
      ],
      query: resultLookupQuery,
      post_filter: {
        terms: {
          _index: indices
        }
      },
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        },
      },
      sort,
    };

    const filters = {
      eventType: [
        { event_type: { terms: { field: "standard.event_type" } } },
        { event_type_display: { terms: { field: "event_type_display" } } },
      ],
      source: [
        { source_type_wp4: { terms: { field: "source_type_wp4" } } },
        { source_type_display: { terms: { field: "source_type_display" } } },
      ],
      eventYear: {
        type: "histogram",
        field: "event_year_sortable",
      },
      sourceYear: {
        type: "histogram",
        field: "sourceyear_sortable",
      },
      birthYear: {
        type: "histogram",
        field: "birthyear_sortable",
      },
      deathYear: {
        type: "histogram",
        field: "deathyear_sortable",
      },
    };

    const filterBody = {
      from: from,
      size: 0,
      query: sourceLookupQuery,
      aggs: {},
      post_filter: {
        terms: {
          _index: indices
        }
      },
    };

    Object.keys(filters).forEach((filterName) => {
      const filter = filters[filterName];
      if(filter.type === "histogram") {
        filterBody.aggs[filterName] = {
          histogram: {
            field: filter.field,
            interval: 10,
          },
        };
        return;
      }
      filterBody.aggs[filterName] = {
        composite: {
          sources: filter,
          size: 10000,
        },
      };
    });

    return this.search(indices, body, filterBody);
  }

  createQueries(query: AdvancedSearchQuery, sourceFilter: FilterIdentifier[], mode: string, excludeDubiousLinks: boolean, excludeUndoubtedLinks: boolean) {
    const queryIncludingNested = (key, fun) => [ fun(key), fun(`person_appearance.${key}`) ];
    const matchQ = (key, val) => queryIncludingNested(key, (key) => {
      return { match: { [key]: val } };
    });
    const mustQ = (arr) => {
      return { bool: { must: arr } };
    };
    const shouldQ = (arr) => {
      return { bool: { should: arr } };
    };

    const must = [];

    if(excludeDubiousLinks || excludeUndoubtedLinks) {
      const excludedRanges = [];
      if(excludeDubiousLinks) {
        excludedRanges.push({ range: { "links.duplicates": { gt: 1 } } });
      }
      if(excludeUndoubtedLinks) {
        excludedRanges.push({ match: { "links.duplicates": 1 } });
      }

      must.push({ bool: { must_not: excludedRanges } });
    }

    let sourceLookupFilter = must;

    const addFreeTextQuery = (must, value) => {
      // only string fields
      let fields = [
        "*name_searchable",
        "*lastname_searchable",
        "*firstnames_searchable",
        "*birthplace_searchable",
        "*sourceplace_searchable",
        "*gender_searchable",
        "*birthname_searchable",
        "*occupation_searchable",
        "*role_searchable",
      ];

      if(mode === "fuzzy") {
        const fuzzyStringFields = [
          "*name_searchable_fz",
          "*lastname_searchable_fz",
          "*firstnames_searchable_fz",
          "*birthplace_searchable_fz",
          "*occupation_searchable",
          "*role_searchable",
        ];
        fields = fields.concat(fuzzyStringFields);
      }

      must.push({
        simple_query_string: {
          query: value,
          fields,
          default_operator: "and",
          analyze_wildcard: true,
        },
      });
    };

    Object.keys(query).filter((queryKey) => query[queryKey]).forEach((queryKey) => {
      let value = query[queryKey];

      // Special case: query
      if(queryKey === "query") {
        addFreeTextQuery(must, value);
        return;
      }

      const searchKeyConfig = mapSearchKeys[queryKey];

      // Special case handled at the end of this method, after if-return
      if(queryKey == "lifeCourseId") {
        return;
      }

      if(!searchKeyConfig) {
        return console.warn("[elasticsearch.service] key we don't know how to search on provided", queryKey);
      }

      if(searchKeyConfig.exact) {
        must.push(shouldQ(queryIncludingNested(searchKeyConfig.exact, (key) => {
          return { term: { [key]: value } };
        })));
        return;
      }

      const searchKey = searchKeyConfig[mode];

      const getSearchKeyQuery = (searchKey, value) => {
        const searchKeySubQuery = [];

        if(value.includes('"')) {
          const parts = value.split('"');

          // If there are less than 3 parts, there is only one quotation mark
          // Likewise, the number of parts must be uneven if there is an even number of quotation marks
          if(parts.length >= 3 && parts.length % 2 == 1) {
            // Quoted parts are every other part starting at index 1
            const quoted = parts.filter((_, i) => i % 2 == 1);

            // Unquoted parts are the opposite
            const unquoted = parts.filter((_, i) => i % 2 == 0);

            quoted.forEach((quotedValue) => {
              searchKeySubQuery.push(shouldQ(queryIncludingNested(searchKey, (key) => {
                return { match_phrase: { [key]: { query: quotedValue } } };
              })));
            });

            // We send the unquoted parts back to normal value handling.
            // If there are none, we don't need to continue.
            value = unquoted.join(" ").trim();
          }
        }

        if(!value) {
          // Everything was quoted
          if(searchKeySubQuery.length > 1) {
            return { bool: { must: searchKeySubQuery } };
          }

          return searchKeySubQuery[0];
        }

        const terms = value.split(/\s+/g);
        const wildcardTerms = terms.filter((value) => /[\?\*]/.test(value));
        const nonWildcardTerms = terms.filter((value) => !/[\?\*]/.test(value));

        wildcardTerms.forEach((value) => {
          searchKeySubQuery.push(shouldQ(queryIncludingNested(searchKey, (key) => {
            return { wildcard: { [key]: { value } } };
          })));
        });

        if(nonWildcardTerms.length) {
          searchKeySubQuery.push(shouldQ(queryIncludingNested(searchKey, (key) => {
            return {
              match: {
                [key]: {
                  // Match query splits into terms on space, so we can simplify the query here
                  query: nonWildcardTerms.join(" "),
                  operator: "AND",
                }
              }
            };
          })));
        }

        if(searchKeySubQuery.length > 1) {
          return mustQ(searchKeySubQuery);
        }

        return searchKeySubQuery[0];
      }

      const searchKeyQuery = getSearchKeyQuery(searchKey, value);
      must.push(searchKeyQuery);
    });

    if(sourceFilter.length) {
      // Copy must into sourceLookupFilter to avoid the following push being added to this list, too
      sourceLookupFilter = [ ...must ];

      const filtersGroupedByFilterType = groupBy(sourceFilter, 'filter_type');

      const eventTypeFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType.eventType.map(({ event_type, event_type_display }) => {
          return mustQ([
            shouldQ(matchQ("standard.event_type", event_type)),
            shouldQ(matchQ("event_type_display", event_type_display)),
          ]);
        });
      }

      // Add source filter to only the must filter (but not the source lookup filter)
      if(filtersGroupedByFilterType.eventType && filtersGroupedByFilterType.eventType.length) {
        must.push(shouldQ(eventTypeFilters(filtersGroupedByFilterType)));
      }

      const sourceTypeFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType.source.map(({ source_type_wp4, source_type_display }) => {
          return mustQ([
            shouldQ(matchQ("source_type_wp4", source_type_wp4)),
            shouldQ(matchQ("source_type_display", source_type_display)),
          ]);
        });
      }

      if(filtersGroupedByFilterType.source && filtersGroupedByFilterType.source.length) {
        must.push(shouldQ(sourceTypeFilters(filtersGroupedByFilterType)));
      }

      const histogramFilters = (filterValues, key) => {
        return filterValues.map(({ value }) => {
          return shouldQ(queryIncludingNested(key, (key) => {
            return { range: { [key]: { gte: value, lt: value + 10 } } };
          }));
        });
      }

      Object.entries({
        eventYear: "event_year_sortable",
        sourceYear: "sourceyear_sortable",
        birthYear: "birthyear_sortable",
        deathYear: "deathyear_sortable",
      }).forEach(([ filterType, filterKey ]) => {
        if(filtersGroupedByFilterType[filterType] && filtersGroupedByFilterType[filterType].length) {
          must.push(shouldQ(histogramFilters(filtersGroupedByFilterType[filterType], filterKey)));
        }
      });
    }

    const simplifiedQueryFromMust = (must) => {
      if(must.length < 1) {
        return null;
      }
      if(must.length == 1) {
        return must[0];
      }
      return {
        bool: { must },
      };
    };

    const getFullPersonAppearanceQueryFromMustQuery = (must, nested?: boolean) => {
      const query = simplifiedQueryFromMust(must);

      if(!query) {
        return undefined;
      }

      if(!nested) {
        return query;
      }

      return {
        bool: {
          should: [
            query,
            {
              nested: {
                path: "person_appearance",
                query,
                score_mode: "max",
              },
            },
          ],
        }
      };
    };

    const resultLookupQuery: Record<string, any> = getFullPersonAppearanceQueryFromMustQuery(must);
    const sourceLookupQuery: Record<string, any> = getFullPersonAppearanceQueryFromMustQuery(sourceLookupFilter, false);

    if(!query.lifeCourseId) {
      return { resultLookupQuery, sourceLookupQuery };
    }

    // Special case: life_course_id
    const includeLifeCourseInQuery = (oldQuery) => {
      const lifeCourseIdTerm = { term: { life_course_id: query.lifeCourseId } };
      if(!oldQuery) {
        return lifeCourseIdTerm;
      }

      return mustQ([
        lifeCourseIdTerm,
        oldQuery,
      ]);
    };
    return {
      resultLookupQuery: includeLifeCourseInQuery(resultLookupQuery),
      sourceLookupQuery: includeLifeCourseInQuery(sourceLookupQuery),
    };
  }

  getEntryCounts(): Observable<EntryCounts> {
    const body = {
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        },
      },
    };

    return this.http.post<EntryCountsEsResult>(`${environment.esUrl}/pas,lifecourses/_search`, body)
      .pipe(map((esResult): EntryCounts => {
        const result: EntryCounts = {
          totalHits: 0,
          indexHits: {},
        };

        esResult.aggregations.count.buckets.forEach((value) => {
          result.totalHits += value.doc_count;
          if (value.key.includes("pas")) {
            result.indexHits.pas = value.doc_count;
          }
          if (value.key.includes("lifecourses")) {
            result.indexHits.lifeCourses = value.doc_count;
          }
        });

        return result;
      }));
  }

  getLifecourse(key: string): Observable<Lifecourse> {
    return new Observable(
      observer => {
         this.http.get<Lifecourse>(`${environment.apiUrl}/lifecourse/${key}`)
          .subscribe(next => {
            observer.next(next as Lifecourse);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }

  getPersonAppearance(id: string|number): Observable<PersonAppearance> {
    return new Observable(
      observer => {
        this.http.get<PersonAppearance>(`${environment.apiUrl}/PersonAppearance/${id}`)
        .subscribe(next => {
            try {
              observer.next(next as PersonAppearance);
            } catch (error) {
              observer.error(error);
            }
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }
};
