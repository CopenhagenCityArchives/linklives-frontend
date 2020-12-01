import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from 'src/app/search-term-values';

@Component({
  selector: 'app-search-history',
  templateUrl: './component.html',
})

export class SearchHistoryComponent implements OnInit {
  @Input() openSearchHistory: boolean;
  @Input() featherIconPath: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  searchHistory: SearchHistoryEntry[] = getSearchHistory();
  searchFieldLabels = searchFieldLabels;

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
    console.warn("searchHistory", this.searchHistory)
  }

  closeSearchHistory() {
    this.close.emit(null);
  }
}
