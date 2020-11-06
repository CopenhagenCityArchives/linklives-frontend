import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { SearchResult } from '../search/search.service';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {

  searchResult: SearchResult;
  query?: string;
  firstName?: string;
  lastName?: string;
  parish?: string;
  birthPlace?: string;
  index: string;

  pagination: { current: number, last: number, size: number, navigationPages: number[]; }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParamMap => {
      this.query = queryParamMap.get('query');
      this.firstName = queryParamMap.get('firstName');
      this.lastName = queryParamMap.get('lastName');
      this.parish = queryParamMap.get('parish');
      this.birthPlace = queryParamMap.get('birthPlace');
      this.index = queryParamMap.get('index');
    });

    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      this.searchResult = data.searchResult;

      this.route.paramMap.subscribe(paramMap => {
        // page defaults to 1
        let page = Number(paramMap.get('page'));
        if (page < 1 || page == NaN) {
          page = 1;
        }

        let size = Number(paramMap.get('size'));
        if (size < 1 ||page == NaN) {
          size = 10;
        }
        
        let pageStart = Math.max(1, page - 2);
        let totalPages = Math.ceil(this.searchResult.totalHits / size);
        let pageEnd = Math.min(pageStart + 4, totalPages);

        // if there are less than two pages after current, expand pagination
        // in the lower direction
        if (pageEnd - page < 2) {
          pageStart = Math.max(1, pageEnd - 4);
        }

        this.pagination = {
          current: page,
          last: pageEnd,
          size: size,
          navigationPages: []
        }

        for (let page = pageStart; page <= pageEnd; page ++) {
          this.pagination.navigationPages.push(page);
        }
      });
    });
  }

}
