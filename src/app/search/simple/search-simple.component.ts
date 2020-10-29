import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  birthYear: Number = null;

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
    let navigationExtras = {
      queryParams: { 'query': this.query }
    };
      
    this.router.navigate(['/results'], navigationExtras);
  }

  searchAdvanced(): void {
    console.log("firstName", this.firstName);
  }

}
