import { EventType } from "../data/data.service";

export function eventIcon(eventType: EventType) {
  return {
    'arrival': 'clipboard',
    'baptism': "ll-baptism",
    'babtism': "ll-baptism",
    "burial": "ll-funeral",
    "burial_protocol": "ll-funeral",
    "census": "archive",
    'confirmation': "ll-confirmation",
    'departure': "clipboard",
    'marriage': "heart",
    'spouse': "heart",
  }[eventType] || "circle";
};

export const filterTypes = ['eventType', 'source', 'eventYear', 'birthYear', 'deathYear'];
export const yearFilterTypes = ['eventYear', 'birthYear', 'deathYear'];

export function filterTitle(filterType: string) {
  return {
    'eventType': "Hændelser",
    'source': "Kilder",
    'eventYear': "Hændelses år",
    'birthYear': "Fødeår",
    'deathYear': 'Dødsår',
  }[filterType];
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
