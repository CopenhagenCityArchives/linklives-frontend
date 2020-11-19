import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

import { AdvancedSearchQuery, SearchResult } from '../search/search.service';

interface SearchQueryParams {
  query?: string,
  firstName?: string,
  lastName?: string,
  parish?: string,
  county?: string,
  birthPlace?: string,
  maritalStatus?: string,
}

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {
  searchResult: SearchResult;
  searchQueryParams: SearchQueryParams;
  index: string;
  indexSource: boolean = true;
  indexLifecourse: boolean = true;

  pagination: { current: number, last: number, size: number, navigationPages: number[]; }

  searchParams: AdvancedSearchQuery = {};

  get computedIndex() {
    if((this.indexLifecourse && this.indexSource) || (!this.indexLifecourse && !this.indexSource)) {
      return 'pas,lifecourses';
    }
    else if(this.indexSource) {
      return 'pas';
    }
    else if(this.indexLifecourse) {
      return 'lifecourses';
    }
  }

  get lifeCourseQueryParams() {
    return {...this.searchQueryParams, index: 'lifecourses'};
  }

  get personAppearanceQueryParams() {
    return {...this.searchQueryParams, index: 'pas'};
  }

  get queryParams() {
    return {...this.searchQueryParams, index: this.computedIndex};
  }

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const possibleSearchQueryParams = [
      "query",
      "firstName",
      "lastName",
      "birthName",
      "birthPlace",
      "sourcePlace",
      //"deathPlace",
      "birthYear",
      "sourceYear",
      "deathYear",
      //"maritalStatus",
    ];

    this.route.queryParamMap.subscribe(queryParamMap => {
      const searchQueryParams = {};
      queryParamMap.keys
        .filter((key) => possibleSearchQueryParams.includes(key))
        .forEach((key) => {
          const value = queryParamMap.get(key);
          searchQueryParams[key] = value;
          this.searchParams[key] = value;
        });
      this.searchQueryParams = searchQueryParams;

      this.index = queryParamMap.get('index');
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
          last: pageEnd,
          size: size,
          navigationPages: []
        }

        for (let page = pageStart; page <= pageEnd; page ++) {
          this.pagination.navigationPages.push(page);
        }
      });
    });
  }

  search(): void {
    this.router.navigate(['/results'], {
      queryParams: { ...this.searchParams, index: this.computedIndex },
    });
  }

}
