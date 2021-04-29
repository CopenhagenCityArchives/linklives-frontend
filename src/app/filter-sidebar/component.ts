import { Component, OnInit, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { eventIcon, eventType, prettyNumbers } from '../display-helpers';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'lls-filter-sidebar',
  templateUrl: './view.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSidebar),
      multi: true
    },
  ],
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class FilterSidebar implements OnInit {
  @Input() featherIconPath: string;
  @Input() possibleSources: Array<{ source_year_display: string, event_type: string, event_type_display: string, count: number }>;
  @Input() openSidebar: boolean;
  @Input()
  get filters() {
    return this._filters;
  }
  set filters(filters: number[]) {
    this._filters = filters;
  }

  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() removeFilter: EventEmitter<any> = new EventEmitter();
  eventIcon = eventIcon;
  eventType = eventType;

  // Start ControlValueAccessor
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  writeValue(filters: number[]) {
    this.filters = filters ? [...filters] : [];
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }
  // End ControlValueAccessor

  filtersWithLabels = [];
  sidebarCategoryOpen: String = undefined;
  _filters: number[] = [];
  onChange: Function = () => {};
  onTouched: Function = () => {};

  get filtersCategories() {
    const result = {};

    this.possibleSources.forEach(x => {
      const filter =  {
        label: `${x.event_type_display} ${x.source_year_display}`,
        type: x.event_type,
        icon: eventIcon(x.event_type),
        value: `${x.event_type}_${x.event_type_display}_${x.source_year_display}`,
        count: prettyNumbers(x.count),
        chosen: false,
      };
      if(!result[x.event_type]) {
        result[x.event_type] = {
          display: x.event_type_display,
          filters: [],
        }
      }
      result[x.event_type].filters.push(filter);
    });
    return result;
  }

  close() {
    this.onChange([...this.filters]);
    this.onTouched();
    this.closeSidebar.emit(null);
  }

  addFilter(option) {
    if(this.filters.find(filterValue => filterValue === option.value)) {
      const elementIndex = this.filters.indexOf(option.value);
      this.filters.splice(elementIndex, 1);
      return;
    }

    this.filters.push(option.value);
  }

  activeFilter(optionValue) {
    return this.filters.some((filterValue) => filterValue === optionValue);
  }

  toggleCategory(type) {
    this.sidebarCategoryOpen = type;
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openSidebar) {
      this.close();
    }
  }

  ngOnInit(): void {}

}
