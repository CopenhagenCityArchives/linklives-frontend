import { Component, OnInit } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';

@Component({
  selector: 'app-search-history',
  templateUrl: './component.html',
})
export class SearchHistoryComponent implements OnInit {
  searchHistory: SearchHistoryEntry[] = getSearchHistory();

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
  }
}
