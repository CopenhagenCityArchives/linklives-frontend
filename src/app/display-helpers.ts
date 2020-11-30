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
