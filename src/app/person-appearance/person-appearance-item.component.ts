import { Component, OnInit, Input } from '@angular/core';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;

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
    return [
      ...new Set(
        [
          this.personAppearance.parish,
          this.personAppearance.district,
          this.personAppearance.county
        ].filter((x) => x)
      )
    ].join(", ");
  }

  constructor() { }

  ngOnInit(): void {
  }

}
