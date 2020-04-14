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
    this.page = Math.floor(this.start / this.size) + 1;

    this.route.queryParamMap.subscribe(queryParamMap => {
      if (queryParamMap.has("query")) {
        this.query = queryParamMap.get("query");
      }
      if (queryParamMap.has("index")) {
        this.index = queryParamMap.get("index");
      } else {
        this.index = undefined;
      }
    });

    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      console.log("search result list got next", data);
      this.searchResult = data.searchResult;

      this.route.paramMap.subscribe(paramMap => {
        if (paramMap.has("start")) {
          this.start = Number(paramMap.get("start"));
          this.page = Math.floor(this.start / this.size) + 1;
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
    }, error => {
      console.log("search result list got error", error);
    }, () => {
      console.log("search result list got complete");
    });
  }

}
