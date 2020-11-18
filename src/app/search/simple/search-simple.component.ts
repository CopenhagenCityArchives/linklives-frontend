import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdvancedSearchQuery } from '../search.service';

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
  searchTerms = [
    { field: "firstName", value: "" },
    { field: "lastName", value: "" },
    { field: "birthPlace", value: "" },
  ];

  searchFieldPlaceholders = {
    firstName: "Jens",
    lastName: "Eriksen",
    birthName: "Kristensen",
    parish: "Præstø",
    county: "Sorø",
    birthPlace: "Randers",
    sourcePlace: "Agersø",
    deathPlace: "Køge",
    maritalStatus: "Ugift",
    birthYear: "1832",
    sourceYear: "1891",
    deathYear: "1912",
  };

  fieldOptions = [
    { category: "Navn" },
    { value: "firstName", label: "Fornavn" },
    { value: "lastName", label: "Efternavn" },
    { value: "birthName", label: "Fødenavn" },
    { category: "Sted" },
    { value: "birthPlace", label: "Fødested" },
    { value: "sourcePlace", label: "Kildested" },
    { value: "deathPlace", label: "Dødssted", disabled: true },
    { category: "År" },
    { value: "birthYear", label: "Fødselsår", disabled: true },
    { value: "sourceYear", label: "Kildeår" },
    { value: "deathYear", label: "Dødsår", disabled: true },
    // { category: "Andet" },
    //{ value: "maritalStatus", label: "Civilstand" },
  ];

  get fieldOptionsBySearchTerms() {
    return this.searchTerms.map((_, i) => {
      const alreadyPickedFields = this.searchTerms
        .filter((_, j) => j != i)
        .map((term) => term.field);
      return this.fieldOptions.filter((opt) => !alreadyPickedFields.includes(opt.value));
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParamMap: ParamMap) => {
      if (queryParamMap.has("query")) {
        this.query = queryParamMap.get("query");
      }
    });
  }

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

    this.router.navigate(['/results'], {
      queryParams,
    });
  }

}
