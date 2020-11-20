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
    '(click)': 'toggleOpen()',
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
  @Input() name: string;
  @Input() openSidebar: boolean;

  constructor(private elRef: ElementRef) {}

  isOpen: boolean = false;
  

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  ngOnInit(): void {

  }

}
