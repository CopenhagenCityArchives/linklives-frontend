import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';
import { prettySourceLocation } from '../display-helpers';

@Component({
  selector: 'app-person-appearance',
  templateUrl: './person-appearance.component.html',
  styleUrls: ['./person-appearance.component.scss']
})
export class PersonAppearanceComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance;
  hh: PersonAppearance[];

  get sourceLocation() {
    return prettySourceLocation(this.pa);
  }

  get prettyLastUpdatedDate() {
    const months = [
      "januar",
      "februar",
      "marts",
      "april",
      "maj",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "december",
    ];
    const date = new Date(this.pa.last_updated);
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  standardizedDataFields = {
    id: "id",
    event_type: "event_type",
    role: "role",
    name_clean: "name_clean",
    name_std: "name_std",
    first_names: "first_names",
    family_names: "family_names",
    patronyms: "patronyms",
    uncat_names: "uncat_names",
    maiden_family_names: "maiden_family_names",
    maiden_patronyms: "maiden_patronyms",
    all_possible_family_names: "all_possible_family_names",
    all_possible_patronyms: "all_possible_patronyms",
    marital_status_clean: "marital_status_clean",
    marital_status_std: "marital_status_std",
    household_position_std: "household_position_std",
    gender_clean: "gender_clean",
    gender_std: "gender_std",
    age_clean: "age_clean",
    hh_id: "hh_id",
    full_address: "full_address",
    birth_place_clean: "birth_place_clean",
    birth_place_parish: "birth_place_parish",
    birth_place_district: "birth_place_district",
    birth_place_county: "birth_place_county",
    birth_place_koebstad: "birth_place_koebstad",
    birth_place_town: "birth_place_town",
    birth_place_place: "birth_place_place",
    birth_place_island: "birth_place_island",
    birth_place_other: "birth_place_other",
    birth_place_parish_std: "birth_place_parish_std",
    birth_place_county_std: "birth_place_county_std",
    birth_place_koebstad_std: "birth_place_koebstad_std",
  };

  get standardizedDataLines() {
    return Object.keys(this.standardizedDataFields)
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.standardizedDataFields[key], value: this.pa[key] }));
  }

  sourceDataFields = {
    source_id: "Kilde ID",
    source_year: "Kildeår",
    source_reference: "source_reference",
    transcription_code: "transcription_code",
    transcription_id: "transcription_id",
    household_family_no: "Husstands nr.",
  };

  get sourceDataLines() {
    return Object.keys(this.sourceDataFields)
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
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
    occupation: "Erhverv",
    age: "Alder",
    gender: "Køn",
    birth_place: "Fødested",
    household_position: "Stilling i husstanden",
    marital_status: "Civilstand",
    address: "? (address)",
    place_name: "Stednavn",
    land_register_address: "? (land_register_address)",
    land_register: "? (land_register)",
    parish: "Bopæl sogn",
    district: "Bopæl herred",
    county: "Bopæl amt",
    parish_type: "parish_type",
    state_region: "Land",
    transcriber_comments: "Indtasters kommentar",
  };

  get originalDataLines() {
    return Object.keys(this.originalDataFields)
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.originalDataFields[key], value: this.pa[key] }));
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.hh = resolve.item.hh as PersonAppearance[];
    });
  }

}
