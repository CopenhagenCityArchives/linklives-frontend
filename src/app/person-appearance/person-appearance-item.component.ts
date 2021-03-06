import { Component, OnInit, Input } from '@angular/core';
import { eventIcon } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

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

  get eventIcon() {
    return eventIcon(this.personAppearance.event_type);
  }

  get eventTypeClass() {
    if(this.personAppearance.event_type !== 'burial') {
      return this.personAppearance.event_type;
    }
    if(this.personAppearance.source_type_wp4 == "parish") {
      return `${this.personAppearance.event_type}-pr`
    }
    return `${this.personAppearance.event_type}-cph`
  }

  constructor() { }

  ngOnInit(): void {
  }

}
