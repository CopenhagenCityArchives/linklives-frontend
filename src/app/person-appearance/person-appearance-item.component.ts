import { Component, OnInit, Input } from '@angular/core';
import { eventType, prettyBirthLocation, prettyBirthYear, prettyDeathYear, prettySourceLocation, prettyFullName, eventIcon } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;
  @Input("truncatableName") showTitleOnName: boolean = false;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get eventType() {
    return eventType(this.personAppearance);
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
    if(this.personAppearance.role != "unknown" && this.personAppearance.role) {
      if(this.personAppearance.role === "deceased") {
        return "afdøde"
      }
      return this.personAppearance.role;
    }

    if(this.personAppearance.household_position_std != "unknown" && this.personAppearance.household_position_std) {
      return this.personAppearance.household_position_std;
    }

    if(this.personAppearance.household_position != "unknown" && this.personAppearance.household_position) {
      return this.personAppearance.household_position;
    }

    return "";
  }

  get occupation() {
    return this.personAppearance.occupation || this.personAppearance.positions || "";
  }

  constructor() { }

  ngOnInit(): void {
  }

}
