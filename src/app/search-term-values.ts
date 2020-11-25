import { Category, Option } from './form-elements/dropdown/component';

export const mapQueryMustKey = {
  firstName: "first_names",
  sourceYear: "source_year",
};

export const mapQueryShouldKey = {
  birthPlace: [
    "birth_place",
    "birth_place_clean",
    "birth_place_county",
    "birth_place_county_std",
    "birth_place_district",
    "birth_place_island",
    "birth_place_koebstad",
    "birth_place_koebstad_std",
    "birth_place_other",
    "birth_place_parish",
    "birth_place_parish_std",
    "birth_place_place",
    "birth_place_town",
  ],
  lastName: [
    "all_possible_family_names",
    "all_possible_patronyms",
    "family_names",
    "maiden_family_names",
    "maiden_patronyms",
    "patronyms"
  ],
  birthName: [
    "maiden_family_names",
    "maiden_patronyms",
  ],
  sourcePlace: [
    "parish",
    "county",
    "district",
  ],
  maritalStatus: [
    "marital_status",
    "marital_status_clean",
    "marital_status_std"
  ],
};

export const sortValues = {
  relevance: [ "_score" ],
  firstName: [ "first_names" ],
  lastName: [ "all_possible_family_names", "all_possible_patronyms" ],
  birthName: [ "maiden_family_names", "maiden_patronyms" ],
  birthPlace: [ "birth_place" ],
  sourcePlace: [ "parish", "county", "district" ],
  sourceYear: [ "source_year" ],
};

// Advanced search
export const searchFieldPlaceholders = {
  query: "Indtast fritekstsøgning",
  firstName: "Indtast fornavn",
  lastName: "Indtast efternavn",
  birthName: "Indtast fødenavn",
  birthPlace: "Indtast fødested",
  sourcePlace: "Indtast kildested",
  //deathPlace: "Indtast dødssted",
  //birthYear: "Indtast fødeår",
  sourceYear: "Indtast kildeår",
  //deathYear: "Indtast dødsår",
  //maritalStatus: "Indtast civilstand",
};

export const possibleSearchQueryParams = Object.keys(searchFieldPlaceholders);

export const sortByOptions = [
  { label: "Tilfældig", value: "random" },
  { label: "Relevans", value: "relevance", disabled: true },
  { label: "Fornavn", value: "firstName" },
  { label: "Efternavn", value: "lastName" },
  { label: "Fødselsnavn", value: "birthName" },
  { label: "Fødested", value: "birthPlace" },
  { label: "Kildested", value: "sourcePlace" },
  { label: "Kildeår", value: "sourceYear" },
];

export const searchFieldLabels = {
  query: "Fritekst",
  firstName: "Fornavn",
  lastName: "Efternavn",
  birthName: "Fødenavn",
  birthPlace: "Fødested",
  sourcePlace: "Kildested",
  deathPlace: "Dødssted",
  birthYear: "Fødselsår",
  sourceYear: "Kildeår",
  deathYear: "Dødsår",
  //maritalStatus: "Civilstand",
};

export function toFieldOption(key) {
  return {
    label: searchFieldLabels[key],
    value: key,
    disabled: !searchFieldPlaceholders[key],
  };
}

export const allNameFields: Array<Option | Category> = [
  "firstName",
  "lastName",
  "birthName"
].map((f) => toFieldOption(f));

export const allPlaceFields: Array<Option | Category> = [
  "birthPlace",
  "sourcePlace",
  "deathPlace"
].map((f) => toFieldOption(f));

export const allYearFields: Array<Option | Category> = [
  "birthYear",
  "sourceYear",
  "deathYear"
].map((f) => toFieldOption(f));

export const fieldOptions = [
  { category: "Navn" },
  ...allNameFields,
  { category: "Sted" },
  ...allPlaceFields,
  { category: "År" },
  ...allYearFields,
];
