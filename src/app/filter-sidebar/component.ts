import { Component, OnInit, ElementRef, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
})

export class FilterSidebar implements OnInit {
  @Input() featherIconPath: string;
  @Input() possibleYears: Array<number>;
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
  _filters: number[] = [];
  onChange: Function = () => {};
  onTouched: Function = () => {};

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
    return this.filters.some((filterValue) => filterValue === optionValue)
  }

  ngOnInit(): void {
    this.filtersWithLabels = this.possibleYears.map(x => ({ "label": `Folketælling ${x}`, "value": x, "chosen": false }));
  }

}
