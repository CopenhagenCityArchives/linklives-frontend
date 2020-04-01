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
    this.addField({ id: 2, name: "Sted", description: "Sted for person" });
    this.addField({ id: 3, name: "År", description: "År for person" });
  }

  addField(type? : { id: number, name: string, description: string }): void {
    if (type) {
      this.fields.push({ type: type, value: null });
    } else {
      this.fields.push({ type: { id: 1, name: 'Navn', description: 'Navn på person' }, value: null});
    }
  }

  search(): void {
    let navigationExtras = {
      queryParams: { 'query': this.query }
    };
      
    this.router.navigate(['/results'], navigationExtras);
  }

}
