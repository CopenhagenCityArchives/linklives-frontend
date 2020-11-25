import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdvancedSearchQuery } from '../search.service';
import { searchFieldPlaceholders, fieldOptions, searchFieldLabels, getFieldOptions } from 'src/app/search-term-values';

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

  indexSource = true;
  indexLifecourse = true;

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

  get fieldOptions() {
    const isNotUsed = (option) => !this.searchTerms.some((term) => option.value && term.field == option.value);
    return getFieldOptions(isNotUsed);
  }

  constructor(private router: Router) { }

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
    const searchParams: AdvancedSearchQuery = {};

    this.searchTerms
      .filter((term) => term.value !== "")
      .forEach((term) => searchParams[term.field] = term.value);

    this.router.navigate(['/results'], { queryParams: { ...searchParams, index: this.computedIndex } });
  }

}
