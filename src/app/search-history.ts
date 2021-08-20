import isEqual from 'lodash.isequal';
import { AdvancedSearchQuery, PersonAppearance, FilterIdentifier } from './search/search.service';

const LOCAL_STORAGE_KEY = "lls_search_history";

export enum SearchHistoryEntryType {
  SearchResult = "search_result",
  Lifecourse = "lifecourse",
  Census = "census",
}

export interface SearchResultPagination {
  page: Number,
  size: Number,
}

export interface SearchResultSorting {
  sortBy: string,
  sortOrder: "asc" | "desc",
}

export interface SearchHistoryEntry {
  type: SearchHistoryEntryType,
  query?: AdvancedSearchQuery,
  filters?: FilterIdentifier[],
  index?: string[],
  lifecourse?: LifecourseSearchHistoryEntry,
  personAppearance?: PersonAppearance,
  timestamp?: Date,
  pagination?: SearchResultPagination,
  sort?: SearchResultSorting,
  mode?: string,
}

export interface LifecourseSearchHistoryEntry {
  key: string,
  personAppearances: PersonAppearance[],
}

export interface SearchHistoryEntryListener {
  (entry: SearchHistoryEntry[]) : void;
}

let localStorageEnabled = true;

if(!("localStorage" in window)) {
  localStorageEnabled = false;
}

try {
  window.localStorage.getItem("sagk8h2ldlakncl2llsæ");
}
catch(error) {
  localStorageEnabled = false;
}

const inMemoryStore = {};

const storeValue = localStorageEnabled ?
  (key, value) => localStorage.setItem(key, JSON.stringify(value)) :
  (key, value) => inMemoryStore[key] = value;

const retrieveValueFromLocalStorage = (key) => {
  const raw = localStorage.getItem(key);
  if(!raw) {
    return null;
  }

  let result;
  try {
    result = JSON.parse(raw);
  }
  catch(error) {
    console.error("Tried to read value from localStorage that was not JSON; removed it!");
    localStorage.removeItem(key);
    return null;
  }
  return result;
};

const retrieveValue = localStorageEnabled ?
  retrieveValueFromLocalStorage :
  (key) => inMemoryStore[key];

const listeners: SearchHistoryEntryListener[] = [];

export function onSearchHistoryEntry(listener: SearchHistoryEntryListener): void {
  listeners.push(listener);
}

export function addSearchHistoryEntry(entry: SearchHistoryEntry): void {
  entry.timestamp = new Date();

  const existingHistory = getSearchHistory();

  const entryData = unpick(entry, "timestamp", "pagination", "sort", "filters");

  const history = [
    entry,
    ...existingHistory.filter((existingEntry) => {
      return !isEqual(entryData, unpick(existingEntry, "timestamp", "pagination", "sort", "filters"));
    })
  ].slice(0, 50);

  storeValue(LOCAL_STORAGE_KEY, history);
  listeners.forEach((listener) => listener([ ...history ]));
}

export function getSearchHistory(): SearchHistoryEntry[] {
  const history = retrieveValue(LOCAL_STORAGE_KEY) || [];
  return history
    // Filter out old lifecourses with no personAppearances
    .filter((entry) => entry.type !== 'lifecourse' || (entry.lifecourse.personAppearances && entry.lifecourse.personAppearances.length ))
    // Filter out old entries with no timestamp
    .filter((entry) => entry.timestamp);
}

export function getLatestSearchQuery() {
  const entry = getSearchHistory().find(item => item.type === "search_result");
  if(entry) {
    let queryParams: any = { ...entry.query };

    if(entry.pagination) {
      const { page: pg, size } = entry.pagination;
      queryParams = { ...queryParams, pg, size };
    }

    if(entry.sort) {
      queryParams = { ...queryParams, ...entry.sort };
    }

    if(entry.filters) {
      queryParams = {
        ...queryParams,
        filters: entry.filters
          .map((filter) => Object.values(filter).join('_'))
          .join(",")
      };
    }

    if(entry.mode) {
      queryParams.mode = entry.mode;
    }

    if(Array.isArray(entry.index)) {
      queryParams.index = entry.index.join(",");
    }

    return queryParams;
  }
  return { query: "" };
}

function unpick(obj, ...keys) {
  const result = {};
  Object.keys(obj)
    .filter((objKey) => !keys.includes(objKey))
    .forEach((objKey) => result[objKey] = obj[objKey]);
  return result;
}
