import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

interface AdvancedSearchQuery {
  firstName?: String,
  lastName?: String,
  parish?: String,
  birthPlace?: String,
}

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
  firstName: String = "";
  lastName: String = "";
  parish: String = "";
  birthPlace: String = "";

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

    if(this.firstName) queryParams.firstName = this.firstName;
    if(this.lastName) queryParams.lastName = this.lastName;
    if(this.parish) queryParams.parish = this.parish;
    if(this.birthPlace) queryParams.birthPlace = this.birthPlace;

    this.router.navigate(['/results'], {
      queryParams,
    });
  }

}
