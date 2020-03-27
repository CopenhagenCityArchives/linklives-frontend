import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchResult } from '../search/search.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {

  searchResult: SearchResult;
  query?: string;
  start: number;
  size: number;
  page: number;
  index: string;
  pages: Array<{ start: number, page: number }>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.start = 0;
    this.size = 10;
    this.index = "pas,lifecourses";
    this.page = Math.floor(this.start / this.size) + 1;

    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      this.searchResult = data.searchResult;

      this.route.queryParamMap.subscribe(queryParamMap => {
        if (queryParamMap.has("query")) {
          this.query = queryParamMap.get("query");
        }
        if (queryParamMap.has("start")) {
          this.start = Number(queryParamMap.get("start"));
          this.page = Math.floor(this.start / this.size) + 1;
        }
        if (queryParamMap.has("index")) {
          this.index = queryParamMap.get("index");
        }

        this.pages = new Array();
        
        let pageStart = this.page - 2;
        if (pageStart < 1) {
          pageStart = 1;
        }

        let pageEnd = pageStart + 4;
        if (pageEnd * this.size > this.searchResult.totalHits) {
          pageEnd = Math.ceil(this.searchResult.totalHits / this.size);
          let pageDiff = pageEnd - pageStart;
          if (pageDiff < 4) {
            pageStart = pageEnd - 4;
            if (pageStart < 1) {
              pageStart = 1;
            }
          }
        }

        for (let page = pageStart; page <= pageEnd; page ++) {
          this.pages.push({ start: (page - 1) * this.size, page: page });
        }
      })
    });
  }

}
