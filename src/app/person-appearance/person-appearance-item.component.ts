import { Component, OnInit, Input } from '@angular/core';
import { eventType, prettyBirthLocation, prettyBirthYear, prettySourceLocation, prettyFirstName, prettyLastName } from '../display-helpers';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;

  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  get eventType() {
    return eventType(this.personAppearance);
  }

  get eventIcon() {
    return {
      "census": "archive",
      "burial": "ll-funeral",
    }[this.personAppearance.event_type] || "circle";
  }

  get birthLocation() {
    return prettyBirthLocation(this.personAppearance);
  }

  get birthYear() {
    return prettyBirthYear(this.personAppearance);
  }

  get sourceLocation() {
    return prettySourceLocation(this.personAppearance);
  }

  get personName() {
    return this.personAppearance.name_clean || `${prettyFirstName(this.personAppearance)} ${prettyLastName(this.personAppearance)}`;
  }

  get personRole() {
    if(this.personAppearance.role != "unknown" && this.personAppearance.role) {
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
