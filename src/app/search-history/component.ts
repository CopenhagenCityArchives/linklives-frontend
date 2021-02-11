import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getSearchHistory, onSearchHistoryEntry, SearchHistoryEntry } from '../search-history';
import { searchFieldLabels } from '../search-term-values';
import { eventType, prettyBirthLocation, prettyBirthYear, prettyYearRange, prettyFullName, eventIcon } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';



@Component({
  selector: 'app-search-history',
  templateUrl: './component.html',
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)'
  }
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
  eventIcon = eventIcon;
  prettyFullName = prettyFullName;

  eventType(pa: PersonAppearance) {
    return eventType(pa);
  }

  queryKeys(entry) {
    return Object.keys(entry.query);
  }

  queryParams(entry) {
    let queryParams = {
      ...entry.query,
    }
    if(Array.isArray(entry.index)) {
      queryParams.index = entry.index.join(",");
    }
    return queryParams;
  }

  ngOnInit(): void {
    onSearchHistoryEntry((history) => this.searchHistory = history);
  }

  closeSearchHistory() {
    this.close.emit(null);
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    // Close sidebar on escape keypress
    if(this.openSearchHistory && event.key === "Escape") {
      this.closeSearchHistory();
    }
  }
}
