import { PersonAppearance } from './search/search.service';

export function eventType({ event_type }) {
  return {
    "census": "Folketælling",
    "burial": "Begravelse",
    'arrival': 'Arrival',
    'baptism': "Dåb",
    'birth': "Fødsel",
    'confirmation': "Konfirmation",
    'death': "Death",
    'departure': "Departure",
    'marriage': "Vielse",
  }[event_type] || "Kilde"
};

export function eventIcon(eventType: string) {
  return {
    "census": "archive",
    "burial": "ll-funeral",
    'arrival': 'clipboard',
    'baptism': "ll-baptism",
    'birth': "ll-baptism",
    'confirmation': "ll-confirmation",
    'death': "ll-funeral",
    'departure': "clipboard",
    'marriage': "heart",
  }[eventType] || "circle";
};

export function sourceIcon(sourceType: string) {
  return {
    "census": "archive",
  }[sourceType] || "circle";
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
  const sortedYears = personAppearances.map(pa => pa.event_year_display).sort();
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
