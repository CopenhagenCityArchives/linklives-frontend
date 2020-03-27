import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResult } from '../search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-simple',
  templateUrl: './search-simple.component.html',
  styleUrls: ['./search-simple.component.scss']
})
export class SimpleSearchComponent implements OnInit {

  query = "";
  error = false;
  searching = false;

  constructor(
    private service: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  search(): void {
    this.searching = true;

    let navigationExtras = {
      queryParams: { 'query': this.query }
    };
      
    this.router.navigate(['/results'], navigationExtras);
  }

}
