import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance, Source } from '../search/search.service';

@Component({
  selector: 'app-source-data',
  templateUrl: './source-data.component.html',
})
export class SourceDataComponent implements OnInit {
  featherSpriteUrl = window["lls"].featherIconPath;

  constructor(private route: ActivatedRoute) { }

  pa: PersonAppearance;
  source: Source;

  standardizedDataFields = {
    census: {
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
    },
    burial: {},
  };

  get standardizedDataLines() {
    return Object.keys(this.standardizedDataFields[this.pa.event_type])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.standardizedDataFields[this.pa.event_type][key], value: this.pa[key] }));
  }

  sourceDataFields = {
    census: {
      source_id: "Kilde ID",
      source_year: "Kildeår",
      source_reference: "source_reference",
      transcription_code: "transcription_code",
      transcription_id: "transcription_id",
      household_family_no: "Husstands nr.",
    },
    burial: {},
  };

  get sourceDataLines() {
    return Object.keys(this.sourceDataFields[this.pa.event_type])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.sourceDataFields[this.pa.event_type][key], value: this.pa[key] }));
  }

  excludeDataFields = [
    "id",
    "pa_id",
    "first_names_sortable",
    "family_names_sortable",
    "last_updated",
    "pa_entry_permalink",
  ];

  get otherDataLines() {
    const alreadyUsedFields = Object.keys(this.standardizedDataFields[this.pa.event_type])
      .concat(Object.keys(this.sourceDataFields[this.pa.event_type]))
      .concat(Object.keys(this.originalDataFields[this.pa.event_type]))
      .concat(this.excludeDataFields);

    return Object.keys(this.pa)
      .filter((key) => !alreadyUsedFields.includes(key))
      .map((key) => ({ label: key, value: this.pa[key] }));
  }

  originalDataFields = {
    census: {
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
    },
    burial: {}
  };

  get originalDataLines() {
    return Object.keys(this.originalDataFields[this.pa.event_type])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.originalDataFields[this.pa.event_type][key], value: this.pa[key] }));
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.source = resolve.item.source as Source;
    });
  }

}
