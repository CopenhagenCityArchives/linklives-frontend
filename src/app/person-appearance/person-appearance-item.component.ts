import { Component, OnInit, Input } from '@angular/core';
import { prettySourceLocation } from '../display-helpers';
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

  get birthLocation() {
    const location = [
      ...new Set(
        [
          this.personAppearance.birth_place_parish,
          this.personAppearance.birth_place_district,
          this.personAppearance.birth_place_county,
          this.personAppearance.birth_place_koebstad,
          this.personAppearance.birth_place_town,
          this.personAppearance.birth_place_place,
          this.personAppearance.birth_place_island,
          this.personAppearance.birth_place_other,
        ].filter((x) => x)
      )
    ].join(", ");
    return location || this.personAppearance.birth_place_clean;
  }

  get sourceLocation() {
    return prettySourceLocation(this.personAppearance);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
