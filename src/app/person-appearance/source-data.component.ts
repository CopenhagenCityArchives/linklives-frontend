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
    burial: {
      gender_clean: "gender_clean",
      gender_std: "gender_std",
      age_clean: "age_clean",
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
      event_type: "event_type",
      role: "role",
      birth_year: "birth_year",
      firstnames_clean: "firstnames_clean",
      firstnames_std: "firstnames_std",
      lastname_clean: "lastname_clean",
      lastname_std: "lastname_std",
      birthname_clean: "birthname_clean",
      birthname_std: "birthname_std",
      street_unique: "street_unique",
    },
    parish: {
      id: 'id',
      birth_year: 'birth_year',
      gender_std: "gender_std",
      age_clean: "age_clean",
      name_std: "name_std",
      first_names: "first_names",
      family_names: "family_names",
      patronyms: "patronyms",
      uncat_names: "uncat_names",
      maiden_family_names: "maiden_family_names",
      maiden_patronyms: "maiden_patronyms",
      all_possible_family_names: "all_possible_family_names",
      all_possible_patronyms: "all_possible_patronyms",
      role: "role",
      event_id: "event_id",
      event_persons: "event_persons",
      main_person_id: "main_person_id",
      date_of_birth: "date_of_birth",
      bpl: "bpl",
      bpl_place: "bpl_place",
      bpl_parish: "bpl_parish",
      bpl_town: "bpl_town",
      bpl_county: "bpl_county",
      bpl_country: "bpl_country",
      bpl_foreign_place: "bpl_foreign_place",
      date_of_event: "date_of_event",
    },
  };

  get standardizedDataLines() {
    return Object.keys(this.standardizedDataFields[this.pa.source_type_wp4])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.standardizedDataFields[this.pa.source_type_wp4][key], value: this.cleanValue(this.pa[key]) }));
  }

  sourceDataFields = {
    census: {
      source_archive_display: "Arkiv",
      source_id: "Kilde nr.",
      source_year_display: "Kildeår",
      source_reference: "Kildehenvisning",
      transcription_code: "Transskriptionskode",
      transcription_id: "Transskriptions ID",
      household_family_no: "Husstands nr.",
    },
    burial: {
      source_archive_display: "Arkiv",
      source_id: "Kilde nr.",
      source_year_display: "Kildeår",
      id_cph: "ID",
      number: "Nummer",
    },
    parish: {
      source_archive_display: "Arkiv",
      EventParish: "Sogn",
      EventCounty: "Herred",
      EventState: "Amt",
      EventCountry: "Land",
      BrowseLevel: "Kilde - herred",
      BrowseLevel1: "Kilde - sogn",
      BrowseLevel2: "Periode",
    }
  };

  get sourceDataLines() {
    return Object.keys(this.sourceDataFields[this.pa.source_type_wp4])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.sourceDataFields[this.pa.source_type_wp4][key], value: this.cleanValue(this.pa[key]) }));
  }

  excludeDataFields = [
    "id",
    "pa_id",
    "first_names_sortable",
    "family_names_sortable",
    "last_updated_wp4",
    "pa_entry_permalink_wp4",
  ];

  get otherDataLines() {
    const alreadyUsedFields = Object.keys(this.standardizedDataFields[this.pa.source_type_wp4])
      .concat(Object.keys(this.sourceDataFields[this.pa.source_type_wp4]))
      .concat(Object.keys(this.originalDataFields[this.pa.source_type_wp4]))
      .concat(this.excludeDataFields);

    return Object.keys(this.pa)
      .filter((key) => !alreadyUsedFields.includes(key))
      .map((key) => ({ label: key, value: this.cleanValue(this.pa[key]) }));
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
      address: "Adresse",
      place_name: "Stednavn",
      land_register_address: "Land adresse",
      land_register: "Land register",
      parish: "Bopæl sogn",
      district: "Bopæl herred",
      county: "Bopæl amt",
      parish_type: "Sogn type",
      state_region: "Land",
      transcriber_comments: "Indtasters kommentar",
    },
    burial: {
      gender: "Køn",
      marital_status: "Civilstand",
      ageYears: "Alder, år",
      ageMonths: "Alder, måneder",
      ageWeeks: "Alder, uger",
      ageDays: "Alder, dage",
      ageHours: "Alder, timer",
      dateOfBirth: "Fødselsdato",
      dateOfDeath: "Dødsdato",
      yearOfBirth: "Fødselsår",
      firstnames: "Fornavn",
      lastname: "Efternavn",
      birthname: "Fødenavn",
      deathplace: "Dødssted",
      adressOutsideCph: "Adresse udenfor København", //[sic]
      comment: "Indtasters kommentar",
      cemetary: "Kirkegård",
      chapel: "Kapel",
      parish: "Sogn",
      street: "Gade",
      hood: "Kvarter",
      street_number: "Gadenummer",
      letter: "Bogstav",
      floor: "Etage",
      institution: "Institution",
      institution_street: "Institution - gade",
      institution_hood: "Institution - kvarter",
      institution_street_unique: "institution_street_unique",
      institution_street_number: "Institution - nummer",
      positions: "Erhverv",
      relationstypes: "Relation til erhverv",
      workplaces: "Arbejdssted",
      deathcauses: "Dødsårsag",
    },
    parish: {
      gender: "Køn",
      GivenName: "Navn",
      Surname: "Efternavn",
      GivenNameAlias: "Alternativt navn",
      SurnameAlias: "Alternativt efternavn",
      NamePrefix: "Titel",
      NameSuffix: "Tilføjelser til navn",
      EventAge: "Alder",
      BirthDay: "Fødselsdato",
      BirthMonth: "Fødselsdato",
      BirthYear: "Fødselsdato",
      BirthPlace: "Fødested",
      EventDay: "Dato i kirkebog",
      EventMonth: "Dato i kirkebog",
      EventYear: "Dato i kirkebog",
      EventPlace: "Sted",
    }
  };

  get originalDataLines() {
    return Object.keys(this.originalDataFields[this.pa.source_type_wp4])
      .filter((key) => {
        const isUndef = typeof this.pa[key] === "undefined";
        if(isUndef) {
          console.warn(`Expected field ${key} on person appearance was undefined.`);
        }
        return !isUndef;
      })
      .map((key) => ({ label: this.originalDataFields[this.pa.source_type_wp4][key], value: this.cleanValue(this.pa[key]) }));
  }

  cleanValue(value) {
    if(Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  }

  get eventTypeClass() {
    const eventType = this.pa.standard.event_type;
    if(eventType !== 'burial') {
      return eventType;
    }
    if(this.pa.source_type_wp4 === 'parish') {
      return `${eventType}-pr`
    }
    return `${eventType}-cph`
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe((resolve) => {
      this.pa = resolve.item.pa as PersonAppearance;
      this.source = resolve.item.pa.source;
    });
  }

}
