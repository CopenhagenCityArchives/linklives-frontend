import { PersonAppearance } from './search/search.service';

export function prettySourceLocation({ parish, parish_type, district, county  }: PersonAppearance) {
  return [
    ...new Set(
      [
        parish_type === "Sogn" ? `${parish} sogn` : parish,
        `${district} herred`,
        `${county} amt`,
      ]
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
    //birth_year: number,
  }: PersonAppearance
) {
  return `ca. ${source_year - age_clean}`;
};
