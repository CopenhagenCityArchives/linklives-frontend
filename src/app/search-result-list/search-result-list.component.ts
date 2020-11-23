import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Category, Option } from '../form-elements/dropdown/component';

import { AdvancedSearchQuery, SearchResult } from '../search/search.service';

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
  index: string;
  indexSource: boolean = true;
  indexLifecourse: boolean = true;

  pagination: {
    current: number,
    firstInOrder: number,
    lastInOrder: number,
    last: number,
    size: number,
    navigationPages: number[],
  };

  sortBy: string = "random";

  sortByOptions = [
    { label: "Tilfældig", value: "random" },
    { label: "Relevans", value: "relevance", disabled: true },
    { label: "Fornavn", value: "firstName" },
    { label: "Efternavn", value: "lastName" },
    { label: "Fødselsnavn", value: "birthName" },
    { label: "Fødested", value: "birthPlace" },
    { label: "Kildested", value: "sourcePlace" },
    { label: "Kildeår", value: "sourceYear" },
  ];

  searchTerms = [];

  searchFieldPlaceholders = {
    query: "Vendsyssel ugift",
    firstName: "Jens",
    lastName: "Eriksen",
    birthName: "Jensby",
    birthPlace: "Randers",
    sourcePlace: "Køge",
    //deathPlace: "Agersø",
    //birthYear: "1834",
    sourceYear: "1845",
    //deathYear: "1912",
    //maritalStatus: "Ugift",
  };

  searchFieldLabels = {
    query: "Fritekst",
    firstName: "Fornavn",
    lastName: "Efternavn",
    birthName: "Fødenavn",
    birthPlace: "Fødested",
    sourcePlace: "Kildested",
    deathPlace: "Dødssted",
    birthYear: "Fødselsår",
    sourceYear: "Kildeår",
    deathYear: "Dødsår",
    //maritalStatus: "Civilstand",
  };

  searchParams: AdvancedSearchQuery = {};

  get config() {
    return window["lls"];
  }

  private toFieldOption(key) {
    return {
      label: this.searchFieldLabels[key],
      value: key,
      disabled: !this.searchFieldPlaceholders[key],
    };
  }

  private allNameFields: Array<Option | Category> = [
    "firstName",
    "lastName",
    "birthName"
  ].map((f) => this.toFieldOption(f));

  private allPlaceFields: Array<Option | Category> = [
    "birthPlace",
    "sourcePlace",
    "deathPlace"
  ].map((f) => this.toFieldOption(f));

  private allYearFields: Array<Option | Category> = [
    "birthYear",
    "sourceYear",
    "deathYear"
  ].map((f) => this.toFieldOption(f));

  get fieldOptions() {
    const isNotUsed = (option) => !this.searchTerms.some((term) => option.value && term.field == option.value);

    const notUsedNameFields = this.allNameFields.filter(isNotUsed);
    let nameOptions = [];
    if(notUsedNameFields.length > 0) {
      nameOptions = [ { category: "Navn" }, ...notUsedNameFields ];
    }

    const notUsedPlaceFields = this.allPlaceFields.filter(isNotUsed);
    let placeOptions = [];
    if(notUsedPlaceFields.length > 0) {
      placeOptions = [ { category: "Sted" }, ...notUsedPlaceFields ];
    }

    const notUsedYearFields = this.allYearFields.filter(isNotUsed);
    let yearOptions = [];
    if(notUsedYearFields.length > 0) {
      yearOptions = [ { category: "År" }, ...notUsedYearFields ];
    }

    return [
      ...nameOptions,
      ...placeOptions,
      ...yearOptions,
    ];
  }

  featherSpriteUrl = this.config.featherIconPath;

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

  get queryParams() {
    return {...this.searchQueryParams, index: this.computedIndex};
  }

  get resultRangeDescription() {
    if(this.searchResult.totalHits < this.pagination.size) {
      return `Viser alle ${this.searchResult.totalHits} resultater`;
    }

    const firstResult = ((this.pagination.current - 1) * this.pagination.size) + 1;
    const lastResult = Math.min(firstResult + this.pagination.size - 1, this.searchResult.totalHits);
    return `Viser ${firstResult}&ndash;${lastResult} af ${this.searchResult.totalHits} resultater`;
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
      //"birthYear",
      "sourceYear",
      //"deathYear",
      //"maritalStatus",
    ];

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

  search(): void {
    const searchParams: AdvancedSearchQuery = {};
    this.searchTerms.forEach((term) => searchParams[term.field] = term.value);

    this.router.navigate(['/results'], {
      queryParams: { ...searchParams, index: this.computedIndex },
    });
  }

}
