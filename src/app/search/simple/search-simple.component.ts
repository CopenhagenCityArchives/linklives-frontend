import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-search-simple',
  templateUrl: './search-simple.component.html',
  styleUrls: ['./search-simple.component.scss']
})
export class SimpleSearchComponent implements OnInit {

  query = "";
  fields = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParamMap: ParamMap) => {
      if (queryParamMap.has("query")) {
        this.query = queryParamMap.get("query");
        console.log("setting query to " + this.query);
      }
    });

    this.addField();
    this.addField();
  }

  addField(): void {
    this.fields.push({ type: { id: 1, name: 'Navn' }, value: null});
  }

  search(): void {
    let navigationExtras = {
      queryParams: { 'query': this.query }
    };
      
    this.router.navigate(['/results'], navigationExtras);
  }

}
