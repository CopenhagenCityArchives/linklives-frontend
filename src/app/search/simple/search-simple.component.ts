import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdvancedSearchQuery } from '../search.service';
import { searchFieldPlaceholders, fieldOptions, searchFieldLabels, allNameFields, allPlaceFields, allYearFields } from 'src/app/search-term-values';

@Component({
  selector: 'app-search-simple',
  templateUrl: './search-simple.component.html',
  styleUrls: ['./search-simple.component.scss']
})
export class SimpleSearchComponent implements OnInit {
  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  // Simple search
  query = "";

  // Advanced search
  searchFieldPlaceholders = searchFieldPlaceholders;
  searchFieldLabels = searchFieldLabels;

  searchTerms = [
    { field: "firstName", value: "" },
    { field: "lastName", value: "" },
    { field: "birthPlace", value: "" },
  ];

  get fieldOptions() {
    const isNotUsed = (option) => !this.searchTerms.some((term) => option.value && term.field == option.value);

    const notUsedNameFields = allNameFields.filter(isNotUsed);
    let nameOptions = [];
    if(notUsedNameFields.length > 0) {
      nameOptions = [ { category: "Navn" }, ...notUsedNameFields ];
    }

    const notUsedPlaceFields = allPlaceFields.filter(isNotUsed);
    let placeOptions = [];
    if(notUsedPlaceFields.length > 0) {
      placeOptions = [ { category: "Sted" }, ...notUsedPlaceFields ];
    }

    const notUsedYearFields = allYearFields.filter(isNotUsed);
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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {}

  searchSimple(): void {
    this.router.navigate(['/results'], {
      queryParams: { query: this.query },
    });
  }

  removeSearchTerm(i: number): void {
    if(this.searchTerms.length > 1) {
      this.searchTerms.splice(i, 1);
    }
  }

  addField(field) {
    this.searchTerms.push({ field, value: "" });
  }

  searchAdvanced(): void {
    const queryParams: AdvancedSearchQuery = {};

    this.searchTerms
      .filter((term) => term.value !== "")
      .forEach((term) => queryParams[term.field] = term.value);

    this.router.navigate(['/results'], { queryParams });
  }

}
