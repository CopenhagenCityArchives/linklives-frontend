import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { AdvancedSearchQuery, SearchResult } from '../search/search.service';
import { sortByOptions, searchFieldPlaceholders, searchFieldLabels, possibleSearchQueryParams, getFieldOptions } from 'src/app/search-term-values';

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
  //deathYear?: string,
  //maritalStatus?: string,
}

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
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

  sourceFilter = [];
  sortBy: string = "relevance";
  sortByOptions = sortByOptions;

  sortAscending = true;

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

  get possibleYears() {
    return this.searchResult.meta.possibleYears.sort();
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

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParamMap) => {
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
        indices.split(",").forEach((index) => this.indices[index].value = true);
      }
      this.sortBy = queryParamMap.get('sortBy') || "relevance";
      this.sortAscending = !(queryParamMap.get('sortOrder') === "desc");
      const sourceFilters = queryParamMap.get('sourceFilter');
      if(sourceFilters) {
        this.sourceFilter = sourceFilters.split(",").filter(x => x).map(x => parseInt(x));
      }
    });

    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      this.searchResult = data.searchResult;

      this.route.paramMap.subscribe(paramMap => {
        // page defaults to 1
        let page = Number(paramMap.get('page'));
        if (page < 1 || page == NaN) {
          page = 1;
        }

        let size = Number(paramMap.get('size'));
        if (size < 1 ||page == NaN) {
          size = 10;
        }
        
        let pageStart = Math.max(1, page - 2);
        let totalPages = Math.ceil(this.searchResult.totalHits / size);
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
        }

        for (let page = pageStart; page <= pageEnd; page ++) {
          this.pagination.navigationPages.push(page);
        }
      });
    });
  }

  addField(field) {
    this.searchTerms.push({ field, value: "" });
  }

  removeFilter(option) {
    this.sourceFilter = this.sourceFilter.filter(item => item != option);
    this.search();
  }

  closeSidebar(event) {
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
      },
    });
  }

}
