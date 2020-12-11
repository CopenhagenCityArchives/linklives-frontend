import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from '../search-term-values';
import { eventType, prettyBirthLocation, prettyBirthYear, prettyYearRange } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

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
  prettyYearRange = prettyYearRange;

  eventType(pa: PersonAppearance) {
    return eventType(pa);
  }

  queryKeys(entry) {
    return Object.keys(entry.query);
  }

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
  }

  closeSearchHistory() {
    this.close.emit(null);
  }
}
