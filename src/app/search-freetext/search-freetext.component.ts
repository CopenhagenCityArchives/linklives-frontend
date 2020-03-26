import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResult } from '../search.service';

@Component({
  selector: 'app-search-freetext',
  templateUrl: './search-freetext.component.html',
  styleUrls: ['./search-freetext.component.scss']
})
export class SearchFreetextComponent implements OnInit {

  query = "";

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  search(): void {
    this.searchService.simpleSearch(this.query, 0, 10)
    .subscribe((result: SearchResult) => {
      console.log(result);
    })
  }

}
