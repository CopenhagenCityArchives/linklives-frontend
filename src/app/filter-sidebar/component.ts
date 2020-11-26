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
  host: {
    '(blur)': 'onBlur();',
  },
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
  @Input() sourceFilter: Array<number>;
  @Input() name: string;
  @Input() openSidebar: boolean;
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<object> = new EventEmitter<object>();
  @Output() removeFilter: EventEmitter<any> = new EventEmitter();

  constructor(private elRef: ElementRef) {}

  isOpen: boolean = false;
  filters = [];

  open() {
    this.openSidebar = true;
  }

  close() {
    this.closeSidebar.emit(null);
  }

  addFilter(option) {
    const chosenOption = this.filters.find(({value}) => value === option.value);
    
    if(this.sourceFilter.find(x => x === chosenOption.value)) {
      chosenOption.chosen = false;
      this.removeFilter.emit(option.value);
      return;
    }

    chosenOption.chosen = true;
    this.change.emit(option.value);
  }

  ngOnInit(): void {
    this.filters = this.possibleYears.map(x => ({ "label": `Folketælling ${x}`, "value": x, "chosen": false }));
  }

}
