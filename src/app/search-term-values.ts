import { Category, Option } from './form-elements/dropdown/component';

export const mapQueryMustKey = {
  sourceYear: "source_year",
  deathYear: "dateOfDeath",
};

export const mapQueryShouldKey = {
  firstName: [
    "first_names",
    "first_names_clean",
    "first_names_std",
  ],
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
    "patronyms",
    "lastname_clean",
  ],
  birthName: [
    "maiden_family_names",
    "maiden_patronyms",
    "birthname_clean",
  ],
  sourcePlace: [
    "parish",
    "county",
    "district",
  ],
  maritalStatus: [
    "marital_status",
    "marital_status_clean",
    "marital_status_std",
  ],
};

export const sortValues = {
  relevance: [ "_score" ],
  firstName: [ "first_names_sortable" ],
  lastName: [ "family_names_sortable" ],
  birthYear: [ "birth_year" ],
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
  deathYear: "Indtast dødsår",
  //maritalStatus: "Indtast civilstand",
};

export const possibleSearchQueryParams = Object.keys(searchFieldPlaceholders);

export const sortByOptions = [
  { label: "Relevans", value: "relevance" },
  { label: "Fornavn", value: "firstName" },
  { label: "Efternavn", value: "lastName" },
  { label: "Fødselsår", value: "birthYear", disabled: true },
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
  // index: "Resultattype",
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

export const allOtherFields: Array<Option | Category> = [
  "query"
].map((f) => toFieldOption(f));

export const fieldOptions = [
  { category: "Navn" },
  ...allNameFields,
  { category: "Sted" },
  ...allPlaceFields,
  { category: "År" },
  ...allYearFields,
  { category: "Andet" },
  ...allOtherFields,
];

export function getFieldOptions(filter) {
  const notUsedNameFields = allNameFields.filter(filter);
  let nameOptions = [];
  if(notUsedNameFields.length > 0) {
    nameOptions = [ { category: "Navn" }, ...notUsedNameFields ];
  }

  const notUsedPlaceFields = allPlaceFields.filter(filter);
  let placeOptions = [];
  if(notUsedPlaceFields.length > 0) {
    placeOptions = [ { category: "Sted" }, ...notUsedPlaceFields ];
  }

  const notUsedYearFields = allYearFields.filter(filter);
  let yearOptions = [];
  if(notUsedYearFields.length > 0) {
    yearOptions = [ { category: "År" }, ...notUsedYearFields ];
  }

  const notUsedOtherFields = allOtherFields.filter(filter);
  let otherOptions = [];
  if(notUsedOtherFields.length > 0) {
    otherOptions = [ { category: "Andet" }, ...notUsedOtherFields ];
  }

  return [
    ...nameOptions,
    ...placeOptions,
    ...yearOptions,
    ...otherOptions
  ];
}
