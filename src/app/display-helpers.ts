import { PersonAppearance } from './search/search.service';

export function prettySourceLocation({ parish, parish_type, district, county, event_type }: PersonAppearance) {
  return [
    ...new Set(
      [
        event_type === "burial" ? "Københavns begravelsesprotokoller" : null,
        parish_type === "Sogn" ? `${parish} sogn` : parish,
        district ? `${district} herred` : null,
        county ? `${county} amt` : null,
      ].filter((x) => x)
    )
  ].join(", ");
};

export function prettyBirthLocation(
  {
    birth_place_parish,
    birth_place_district,
    birth_place_county,
    birth_place_koebstad,
    birth_place_town,
    birth_place_place,
    birth_place_island,
    birth_place_other,
    birth_place_clean,
  }: PersonAppearance
) {
  const location = [
    ...new Set(
      [
        birth_place_parish,
        birth_place_district,
        birth_place_county,
        birth_place_koebstad,
        birth_place_town,
        birth_place_place,
        birth_place_island,
        birth_place_other,
      ].filter((x) => x)
    )
  ].join(", ");

  return location || birth_place_clean;
};

export function prettyBirthYear(
  {
    source_year,
    age_clean,
    birth_year,
  }: PersonAppearance
) {
  return birth_year || `ca. ${source_year - age_clean}`;
};

export function prettyDeathYear(
  {
    dateOfDeath,
  }: PersonAppearance
) {
  return dateOfDeath.split("-")[0];
};

export function prettyFirstName(
  {
    first_names_clean,
    first_names,
  }: PersonAppearance
) {
  if(first_names_clean) {
    return first_names_clean;
  }
  if(first_names.length) {
    return first_names.join(" ");
  }
  return "";
}

export function prettyLastName(
  {
    lastname_clean,
    patronyms,
  }: PersonAppearance
) {
  if(lastname_clean) {
    return lastname_clean;
  }
  if(patronyms.length) {
    return patronyms.join(" ");
  }
  return "";
}

export function eventType({ event_type }: PersonAppearance) {
  return {
    "census": "Folketælling",
    "burial": "Begravelse",
  }[event_type] || "Kilde"
};
