import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { AdvancedSearchQuery, SearchResult } from '../search/search.service';
import { sortByOptions, searchFieldPlaceholders, searchFieldLabels, possibleSearchQueryParams, getFieldOptions } from 'src/app/search-term-values';
import { eventIcon, eventType } from '../display-helpers';

interface SearchQueryParams {
  query?: string,
  firstName?: string,
  lastName?: string,
  birthName?: string,
  birthPlace?: string,
  sourcePlace?: string,
  //deathPlace?: string,
  //birthYear?: string
  sourceYear?: string,
  deathYear?: string,
  id?: string,
  lifeCourseId?: String,
  //maritalStatus?: string,
}

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
})
export class SearchResultListComponent implements OnInit {
  searchResult: SearchResult;
  searchQueryParams: SearchQueryParams;
  openSidebar: boolean = false;
  openSearchHistory: boolean = false;

  pagination: {
    current: number,
    firstInOrder: number,
    lastInOrder: number,
    last: number,
    size: number,
    navigationPages: number[],
  };

  sizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  sourceFilter = [];
  sortBy: string = "relevance";
  sortByOptions = sortByOptions;

  sortAscending = false;

  modeFuzzy = false;

  searchTerms = [];
  searchFieldPlaceholders = searchFieldPlaceholders;
  searchFieldLabels = searchFieldLabels;

  searchParams: AdvancedSearchQuery = {};

  get config() {
    return window["lls"];
  }

  get fieldOptions() {
    const isNotUsed = (option) => !this.searchTerms.some((term) => option.value && term.field == option.value);
    return getFieldOptions(isNotUsed);
  }

  featherSpriteUrl = this.config.featherIconPath;

  indices = {
    pas: { value: false, label: "Kilder" },
    lifecourses: { value: false, label: "Livsforløb" },
  };

  get indexKeys() {
    return Object.keys(this.indices);
  }

  get computedIndex() {
    return this.indexKeys
      .filter((key) => this.indices[key].value)
      .join(",") || null;
  }
  
  get queryParams() {
    return {
      ...this.searchQueryParams,
      index: this.computedIndex,
      sortBy: this.sortBy,
      sortOrder: this.sortAscending ? "asc" : "desc",
      sourceFilter: this.sourceFilter.join(",") || undefined,
    };
  }

  get possibleSources() {
    return this.searchResult.meta.possibleSources.sort((a, b) => {
      if(a.source_year < b.source_year) {
        return -1;
      }
      if(a.source_year > b.source_year) {
        return 1;
      }
      return 0;
    });
  }

  get resultRangeDescription() {
    const prettyTotal = this.prettyPaginationNumber(this.searchResult.totalHits);

    if(this.searchResult.totalHits < this.pagination.size) {
      return `Viser alle ${prettyTotal} resultater`;
    }

    const firstResult = ((this.pagination.current - 1) * this.pagination.size) + 1;
    const lastResult = Math.min(firstResult + this.pagination.size - 1, this.searchResult.totalHits);

    const prettyFirst = this.prettyPaginationNumber(firstResult);
    const prettyLast = this.prettyPaginationNumber(lastResult);

    return `Viser ${prettyFirst}&ndash;${prettyLast} af ${prettyTotal} resultater`;
  }

  prettyPaginationNumber(num: number) {
    return num.toLocaleString("da-DK");
  }

  lastReceivedQueryParamMap = null;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      this.searchResult = data.searchResult;

      if(this.lastReceivedQueryParamMap) {
        this.calculatePagination(this.lastReceivedQueryParamMap);
      }
    });

    this.route.queryParamMap.subscribe((queryParamMap) => {
      this.lastReceivedQueryParamMap = queryParamMap;

      this.searchQueryParams = null;
      this.searchTerms = [];
      const searchQueryParams = {};
      queryParamMap.keys
        .filter((key) => possibleSearchQueryParams.includes(key))
        .forEach((key) => {
          const value = queryParamMap.get(key);
          searchQueryParams[key] = value;
          this.searchTerms.push({ field: key, value });
        });
      this.searchQueryParams = searchQueryParams;

      const indices = queryParamMap.get('index');
      if(indices) {
        // Reset index checkbox values
        Object.keys(this.indices).forEach(index => this.indices[index].value = false);
        indices.split(",").forEach((index) => this.indices[index].value = true);
      }
      this.sortBy = queryParamMap.get('sortBy') || "relevance";
      this.sortAscending = !(queryParamMap.get('sortOrder') === "desc");
      this.modeFuzzy = queryParamMap.get('mode') === "fuzzy";
      const sourceFilters = queryParamMap.get('sourceFilter');
      if(sourceFilters) {
        this.sourceFilter = sourceFilters
          .split(",")
          .filter(x => x);
      }

      // Pagination
      if(!this.searchResult) {
        return;
      }

      this.calculatePagination(queryParamMap);
    });
  }

  calculatePagination(queryParamMap) {
    let size = Number(queryParamMap.get('size'));
    if (size < 1 || !size) {
      size = 10;
    }

    let totalPages = Math.ceil(this.searchResult.totalHits / size);

    // page defaults to 1
    let page = Number(queryParamMap.get('page'));
    if (page < 1 || !page) {
      page = 1;
    }

    let pageStart = Math.max(1, page - 2);
    let pageEnd = Math.min(pageStart + 4, totalPages);

    // if there are less than two pages after current, expand pagination
    // in the lower direction
    if (pageEnd - page < 2) {
      pageStart = Math.max(1, pageEnd - 4);
    }

    this.pagination = {
      current: page,
      firstInOrder: pageStart,
      lastInOrder: pageEnd,
      last: totalPages,
      size: size,
      navigationPages: []
    };

    for (let page = pageStart; page <= pageEnd; page ++) {
      this.pagination.navigationPages.push(page);
    }

    if(page > totalPages) {
      this.pagination.current = 1;
      return this.search();
    }
  }

  getIconFromSourceFilterValue(filterValue: string) {
    const [event_type, _] = filterValue.split("_");
    return eventIcon(event_type);
  }

  getYearFromSourceFilterValue(filterValue: string) {
    const [_, source_year] = filterValue.split("_");
    return source_year;
  }

  getEventTypeFromSourceFilterValue(filterValue: string) {
    const [event_type, _] = filterValue.split("_");
    return eventType({ event_type });
  }

  addField(field) {
    this.searchTerms.push({ field, value: "" });
  }

  removeFilter(option) {
    this.sourceFilter = this.sourceFilter.filter(item => item != option);
    this.search();
  }

  closeSidebar() {
    this.openSidebar = false;
    this.search();
  }

  closeSearchHistory() {
    this.openSearchHistory = false;
  }

  removeSearchTerm(i: number, $event) {
    $event.preventDefault();
    if(this.searchTerms.length > 1) {
      this.searchTerms.splice(i, 1);
    }
  }

  clearSearchTerms() {
    this.searchTerms = [
      { field: "query", value: "" }
    ];
  }

  paginationQueryParams(page) {
    return {
      ...this.queryParams,
      size: this.pagination.size,
      page,
    };
  }

  search(): void {
    const searchParams: AdvancedSearchQuery = {};
    this.searchTerms.forEach((term) => searchParams[term.field] = term.value);

    this.router.navigate(['/results'], {
      queryParams: {
        ...searchParams,
        index: this.queryParams.index,
        sortBy: this.queryParams.sortBy,
        sortOrder: this.queryParams.sortOrder,
        sourceFilter: this.queryParams.sourceFilter,
        mode: this.modeFuzzy ? "fuzzy" : "default",
        page: this.pagination.current || 1,
        size: this.pagination.size,
      },
    });
  }

}
