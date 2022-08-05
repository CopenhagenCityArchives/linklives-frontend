import { Component, OnInit, Input } from '@angular/core';
import { eventIcon } from '../util/display-helpers';
import { PersonAppearance } from '../data/data.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;
  @Input("truncatableName") showTitleOnName: boolean = false;
  @Input("selected") selected: boolean = false;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get computedClass() {
    const classList = [ 'lls-source--' + this.eventTypeClass ];

    if(this.selected) {
      classList.push('lls-source--selected');
    }

    return classList.join(" ");
  }

  get eventType() {
    return this.personAppearance.standard.event_type;
  }

  get eventIcon() {
    return eventIcon(this.eventType);
  }

  get eventTypeClass() {
    if(this.eventType !== 'burial') {
      return this.eventType;
    }
    if(this.personAppearance.source_type_wp4 == "parish") {
      return `${this.eventType}-pr`
    }
    return `${this.eventType}-cph`
  }

  constructor() { }

  ngOnInit(): void {
  }

}
