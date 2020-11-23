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
