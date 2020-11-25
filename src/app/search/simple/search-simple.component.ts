import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdvancedSearchQuery } from '../search.service';
import { searchFieldPlaceholders, fieldOptions } from 'src/app/search-term-values';

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

  searchTerms = [
    { field: "firstName", value: "" },
    { field: "lastName", value: "" },
    { field: "birthPlace", value: "" },
  ];

  get fieldOptionsBySearchTerms() {
    return this.searchTerms.map((_, i) => {
      const alreadyPickedFields = this.searchTerms
        .filter((_, j) => j != i)
        .map((term) => term.field);
      return fieldOptions.filter((opt) => !("value" in opt) || (("value" in opt) && !alreadyPickedFields.includes(opt.value)));
    });
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

  searchAdvanced(): void {
    const queryParams: AdvancedSearchQuery = {};

    this.searchTerms
      .filter((term) => term.value !== "")
      .forEach((term) => queryParams[term.field] = term.value);

    this.router.navigate(['/results'], { queryParams });
  }

}
