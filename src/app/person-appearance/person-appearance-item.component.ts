import { Component, OnInit, Input } from '@angular/core';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance-item',
  templateUrl: './person-appearance-item.component.html',
  styleUrls: ['./person-appearance-item.component.scss']
})
export class PersonAppearanceItemComponent implements OnInit {

  @Input("item") personAppearance: PersonAppearance;

  get personLocation() {
    return [
      ...new Set(
        [
          this.personAppearance.birth_place_parish,
          this.personAppearance.birth_place_district,
          this.personAppearance.birth_place_county
        ].filter((x) => x)
      )
    ].join(", ");
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
