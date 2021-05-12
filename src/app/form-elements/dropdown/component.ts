import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface Category {
  category: string;
}

@Component({
  selector: 'lls-dropdown',
  templateUrl: './view.html',
  host: {
    'tabindex': '0',
    '(click)': 'toggleOpen()',
    '(blur)': 'onBlur();',
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
  @Input() options: Array<Option | Category>;
  @Input() dropdownIcon: string;
  @Input() dropdownIconOpen: string;
  @Input() label: string = "";
  @Input() showCurrentValue: boolean = false;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding("class.lls-dropdown--open")
  isOpen: boolean = false;

  _value: string = "";
  tabHovered?: number = null;

  onChange: Function = () => {};
  onTouched: Function = () => {};

  get currentOption() {
    const options = <Array<Option>> this.options.filter((option) => "value" in option);
    return options.find((opt) => opt.value == this.value);
  }

  get currentOptionLabel() {
    return this.currentOption ? this.currentOption.label : '';
  }

  constructor(private elRef: ElementRef) {}

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

  onBlur() {
    requestAnimationFrame(() => {
      //If a sub-element is still focused, do nothing.
      if(this.elRef.nativeElement.querySelector(":focus")) {
        return;
      }

      this.close();
    });
  }

  onOptionClick(option: Option, $event) {
    if(!("value" in option) || option.disabled) {
      return;
    }

    this.select(<Option> option);
    $event.stopPropagation();
  }

  select(option: Option) {
    this.value = option.value;
    this.close();
    this.elRef.nativeElement.focus();
    this.change.emit(this.value);
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
      this.openAndSelectFirstElement();
      return;
    }

    const indexOfFirstOptionBelow = this.options
      .slice(this.tabHovered + 1)
      .findIndex((option) => ("value" in option) && !(<Option> option).disabled);

    //If no undisabled value below, stay on current
    if(indexOfFirstOptionBelow === -1) {
      return;
    }

    //Otherwise pick first value below
    this.tabHovered = indexOfFirstOptionBelow + this.tabHovered + 1;

    this.focusHoveredElement();
  }

  openAndSelectFirstElement() {
    this.open();

    const indexOfFirstOption = this.options
      .findIndex((option) => ("value" in option) && !(<Option> option).disabled);

    //If no undisabled value, stay on current
    if(indexOfFirstOption === -1) {
      return;
    }

    //Otherwise pick current value
    this.tabHovered = this.options.findIndex((option) => "value" in option && option.value === this.value && !(<Option> option).disabled);

    //Or, if none, pick first value
    if(this.tabHovered === -1) {
      this.tabHovered = indexOfFirstOption;
    }

    //Or, if no values, do nothing
    if(this.tabHovered === -1) {
      this.tabHovered = null;
      return;
    }
    
    this.focusHoveredElement();
  }

  focusHoveredElement() {
    const optionElements = this.elRef.nativeElement.querySelectorAll("[data-lls-dropdown-entry]");
    const optionElement = optionElements[this.tabHovered];
    requestAnimationFrame(() => optionElement.focus());
  }

  tabHoverPreviousItem() {
    if(this.tabHovered === null) {
      return;
    }

    const optionsAbove = this.options
      .slice(0, this.tabHovered);

    const indexOfFirstOptionAbove = optionsAbove
      .reverse()
      .findIndex((option) => ("value" in option) && !(<Option> option).disabled);

    //If no undisabled value below, stay on current
    if(indexOfFirstOptionAbove === -1) {
      return;
    }

    //Otherwise pick first value below
    this.tabHovered = optionsAbove.length - 1 - indexOfFirstOptionAbove;

    this.focusHoveredElement();
  }

  selectTabHoveredItemOrToggleOpen() {
    if(this.tabHovered === null) {
      if(!this.isOpen) {
        this.openAndSelectFirstElement();
        return;
      }

      this.close();
      this.elRef.nativeElement.focus();
      return;
    }

    this.select(<Option> this.options[this.tabHovered]);
  }
}
