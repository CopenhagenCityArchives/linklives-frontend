import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'lls-dropdown',
  templateUrl: './view.html',
  host: {
    'tabindex': '0',
    '(click)': 'toggleOpen()',
    '(blur)': 'close();',
    '(keydown)': 'onKeyPress($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true
    },
  ],
})
export class Dropdown implements ControlValueAccessor {
  @Input() featherIconPath: string;
  @Input() name: string;
  @Input() options: Array<Option>;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  _value: string = "";
  isOpen: boolean = false;
  tabHovered?: number = null;

  onChange: Function = () => {};
  onTouched: Function = () => {};

  get currentLabel() {
    const option = this.options.find((opt) => opt.value == this.value);
    return option ? option.label : '';
  }

  @Output() ngModelChange = new EventEmitter<string>();

  constructor() {}

  // Start ControlValueAccessor
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }
  // End ControlValueAccessor

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.tabHovered = null;
  }

  select(option: Option) {
    this.value = option.value;
    this.close();
  }

  onKeyPress($event) {
    const handler = {
      ArrowDown: () => this.tabHoverNextItem(),
      ArrowUp: () => this.tabHoverPreviousItem(),
      Enter: () => this.selectTabHoveredItemOrToggleOpen(),
      Escape: () => this.close(),
    }[$event.code];

    if(handler) {
      $event.stopPropagation();
      $event.preventDefault();
      handler();
    }
  }

  tabHoverNextItem() {
    if(this.tabHovered === null) {
      this.tabHovered = 0;
      return;
    }
    if(this.tabHovered < this.options.length - 1) {
      this.tabHovered++;
    }
  }

  tabHoverPreviousItem() {
    if(this.tabHovered === null) {
      return;
    }
    if(this.tabHovered > 0) {
      this.tabHovered--;
    }
  }

  selectTabHoveredItemOrToggleOpen() {
    if(this.tabHovered === null) {
      if(!this.isOpen) {
        this.open();
        this.tabHovered = this.options.findIndex((opt) => opt.value === this.value);
      }
      else {
        this.close();
      }
      return;
    }
    this.select(this.options[this.tabHovered]);
    this.tabHovered = null;
  }
}
