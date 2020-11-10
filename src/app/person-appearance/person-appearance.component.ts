import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance',
  templateUrl: './person-appearance.component.html',
  styleUrls: ['./person-appearance.component.scss']
})
export class PersonAppearanceComponent implements OnInit {
  featherSpriteUrl = "/assets/feather-sprite_cbef33d2.svg";

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance;
  hh: PersonAppearance[];
  show: string = 'source';

  get sourceYear() {
    return this.pa.source_year;
  }

  get shortSourceLocation() {
    return `${this.pa.parish}`.replace(/\w\S*/g, (text) => text[0].toUpperCase() + text.slice(1));
  }

  standardizedDataFields = {
    name_std: "Navn",
    marital_status_std: "Civilstand",
    household_position_std: "Husholdsstilling",
    gender_std: "Køn",
    birth_place_parish_std: "Sogn",
    birth_place_county_std: "Amt",
    birth_place_koebstad_std: "Købstad",
  };

  get standardizedDataLines() {
    return Object.keys(this.standardizedDataFields)
      .map((key) => ({ label: this.standardizedDataFields[key], value: this.pa[key] }));
  }

  sourceDataFields = {
    source_type: "Kildetype",
    source_id: "Kilde ID",
    source_year: "Årstal",
    parish: "Sogn",
    county: "Amt",
    koebstad: "Købstad",
  };

  get sourceDataLines() {
    return Object.keys(this.sourceDataFields)
      .map((key) => ({ label: this.sourceDataFields[key], value: this.pa[key] }));
  }

  excludeDataFields = [
    "id",
    "pa_id",
  ];

  get otherDataLines() {
    const alreadyUsedFields = Object.keys(this.standardizedDataFields)
      .concat(Object.keys(this.sourceDataFields))
      .concat(Object.keys(this.originalDataFields))
      .concat(this.excludeDataFields);

    return Object.keys(this.pa)
      .filter((key) => !alreadyUsedFields.includes(key))
      .map((key) => ({ label: key, value: this.pa[key] }));
  }

  originalDataFields = {
    name: "Navn",
    occupation: "Stilling",
    age: "Alder",
    birth_place: "Fødested",
    household_position: "Husstandsstilling",
    marital_status: "Civilstand",
    household_family_no: "Husstandsantal",
    full_address: "Bopæl",
  };

  get originalDataLines() {
    return Object.keys(this.originalDataFields)
      .map((key) => ({ label: this.originalDataFields[key], value: this.pa[key] }));
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.hh = resolve.item.hh as PersonAppearance[];
    });
  }

}
