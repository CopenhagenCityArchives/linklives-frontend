import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from 'src/app/search-term-values';
import { prettyBirthLocation, prettyBirthYear } from '../display-helpers';

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
  prettyBirthLocation = prettyBirthLocation;
  prettyBirthYear = prettyBirthYear;

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
  }

  closeSearchHistory() {
    this.close.emit(null);
  }
}
