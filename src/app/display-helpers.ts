import { PersonAppearance } from './search/search.service';

export function prettySourceLocation({ sourceplace_display, event_type }: PersonAppearance) {
  return [
    ...new Set(
      [
        event_type === "burial" ? "Københavns begravelsesprotokoller" : null,
        sourceplace_display
      ].filter((x) => x)
    )
  ].join(", ");
};

export function prettyBirthLocation(
  {
    birthplace_display,
  }: PersonAppearance
) {
  return birthplace_display;
};

export function prettyBirthYear(
  {
    birthyear_display,
    birthyear_calculated_display,
  }: PersonAppearance
) {
  if(birthyear_display) {
    return birthyear_display;
  }
  if(birthyear_calculated_display) {
    return `ca. ${birthyear_calculated_display}`;
  }
  return "";
};

export function prettyDeathYear(
  {
    dateOfDeath,
  }: PersonAppearance
) {
  if(dateOfDeath) {
    return dateOfDeath.split("-")[0];
  }
  return null;
};

export function prettyFullName(personAppearance: PersonAppearance) {
  return personAppearance.name_display;
}

export function prettyFirstName(
  {
    first_names_clean,
    first_names,
  }: PersonAppearance
) {
  if(first_names_clean) {
    return first_names_clean;
  }
  if(first_names?.length) {
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
  if(patronyms?.length) {
    return patronyms.join(" ");
  }
  return "";
}

export function eventMetaType({ event_type }) {
  const pr = [
    'baptism',
    'birth',
    'confirmation',
    'death',
    'departure',
    'marriage',
  ]
  if(pr.includes(event_type)) {
    return 'pr';
  }
  return event_type;
};

export function eventType({ event_type }) {
  return {
    "census": "Folketælling",
    "burial": "Begravelse",
  }[event_type] || "Kilde"
};

export function eventIcon(eventType: string) {
  return {
    "census": "archive",
    "burial": "ll-funeral",
  }[eventType] || "circle";
};

export function prettyDate(rawDate) {
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
  const date = new Date(rawDate);
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function prettyYearRange(personAppearances) {
  const sortedYears = personAppearances.map(pa => pa.source_year).sort();
  return `${sortedYears[0]} - ${sortedYears[sortedYears.length - 1]}`;
}

function thousandSeparator(str) {
  const sep = ".";
  let output = str.slice(Math.max(0, str.length - 3));
  let i = str.length - 3;
  while (i > 0) {
    output = str.slice(Math.max(0, i - 3), i) + sep + output;
    i -= 3;
  }
  return output;
}

export function prettyNumbers(num, decimals = 0) {
  num = parseFloat(num);
  const [ integer, decimalNumbers ] = num.toFixed(decimals).split(".");
  if(decimalNumbers) {
    return `${thousandSeparator(integer)},${decimalNumbers}`;
  }
  return thousandSeparator(integer);
}
