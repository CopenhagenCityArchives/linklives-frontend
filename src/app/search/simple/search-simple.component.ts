import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdvancedSearchQuery } from '../search.service';

@Component({
  selector: 'app-search-simple',
  templateUrl: './search-simple.component.html',
  styleUrls: ['./search-simple.component.scss']
})
export class SimpleSearchComponent implements OnInit {
  //TODO: we need to be able to set this to a different one in prod, based on the concrete url in the wordpress theme?
  featherSpriteUrl = "/assets/feather-sprite_cbef33d2.svg";

  // Simple search
  query = "";

  // Advanced search
  searchTerms = [
    { field: "firstName", value: "" },
    { field: "lastName", value: "" },
    { field: "parish", value: "" },
    { field: "birthPlace", value: "" },
  ];

  fieldOptions = [
    { key: "firstName", label: "Fornavn" },
    { key: "lastName", label: "Efternavn" },
    { key: "parish", label: "Sogn" },
    { key: "county", label: "Amt" },
    { key: "birthPlace", label: "Fødested" },
    { key: "maritalStatus", label: "Civilstand" },
  ];

  get fieldOptionsBySearchTerms() {
    return this.searchTerms.map((_, i) => {
      const alreadyPickedFields = this.searchTerms
        .filter((_, j) => j != i)
        .map((term) => term.field);
      return this.fieldOptions.filter((opt) => !alreadyPickedFields.includes(opt.key));
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
