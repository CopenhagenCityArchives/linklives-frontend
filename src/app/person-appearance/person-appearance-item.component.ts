import { Component, OnInit, Input } from '@angular/core';
import { eventType, prettyBirthLocation, prettyBirthYear, prettyDeathYear, prettySourceLocation, prettyFullName, eventIcon } from '../display-helpers';
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

  get eventType() {
    return eventType(this.personAppearance);
  }

  get computedClass() {
    const classList = [ 'lls-source--' + this.personAppearance.event_type ];

    if(this.selected) {
      classList.push('lls-source--selected');
    }

    return classList.join(" ");
  }

  get eventIcon() {
    return eventIcon(this.personAppearance.event_type);
  }

  get birthLocation() {
    return prettyBirthLocation(this.personAppearance);
  }

  get birthYear() {
    return prettyBirthYear(this.personAppearance);
  }

  get deathYear() {
    return prettyDeathYear(this.personAppearance);
  }

  get sourceLocation() {
    return prettySourceLocation(this.personAppearance);
  }

  get personName() {
    return prettyFullName(this.personAppearance);
  }

  get personRole() {
    return this.personAppearance.role_display;
  }

  get occupation() {
    return this.personAppearance.occupation_display;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
