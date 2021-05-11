import { Category, Option } from './form-elements/dropdown/component';

export const mapSearchKeys = {
  id: {
    exact: "id",
  },
  firstName: {
    default: "firstnames_searchable",
    fuzzy: "firstnames_searchable_fz",
  },
  lastName: {
    default: "lastname_searchable",
    fuzzy: "lastname_searchable_fz",
  },
  //birthName: {}, //no appropriate fields in frontend yet
  birthPlace: {
    default: "birthplace_searchable",
    fuzzy: "birthplace_searchable_fz",
  },
  sourcePlace: {
    default: "sourceplace_searchable",
    fuzzy: "sourceplace_searchable",
  },
  birthYear: {
    default: "birthyear_searchable",
    fuzzy: "birthyear_searchable_fz",
  },
  sourceYear: {
    default: "source_year_searchable",
    fuzzy: "source_year_searchable_fz",
  },
  deathYear: {
    default: "deathyear_searchable",
    fuzzy: "deathyear_searchable_fz",
  },
};

export const sortValues = {
  relevance: [ "_score" ],
  firstName: [ "first_names_sortable" ],
  lastName: [ "family_names_sortable" ],
  birthYear: [ "birthyear_sortable" ],
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
  birthYear: "Indtast fødeår",
  sourceYear: "Indtast kildeår",
  deathYear: "Indtast dødsår",
  id: "Kilde ID",
  lifeCourseId: "Livsforløbs ID",
  //maritalStatus: "Indtast civilstand",
};

export const possibleSearchQueryParams = Object.keys(searchFieldPlaceholders);

export const sortByOptions = [
  { label: "Relevans", value: "relevance" },
  { label: "Fornavn", value: "firstName" },
  { label: "Efternavn", value: "lastName" },
  { label: "Fødselsår", value: "birthYear" },
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
  id: "Kilde ID",
  lifeCourseId: "Livsforløbs ID",
  // index: "Resultattype",
  // maritalStatus: "Civilstand",
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
  "query",
  "id",
  "lifeCourseId",
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
