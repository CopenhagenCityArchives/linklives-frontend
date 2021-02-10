import isEqual from 'lodash.isequal';
import { AdvancedSearchQuery, PersonAppearance } from './search/search.service';

const LOCAL_STORAGE_KEY = "lls_search_history";

export enum SearchHistoryEntryType {
  SearchResult = "search_result",
  Lifecourse = "lifecourse",
  Census = "census",
}

export interface SearchHistoryEntry {
  type: SearchHistoryEntryType,
  query?: AdvancedSearchQuery,
  index?: string[],
  lifecourse?: LifecourseSearchHistoryEntry,
  personAppearance?: PersonAppearance,
  timestamp?: Date,
}

export interface LifecourseSearchHistoryEntry {
  id: string,
  personAppearances: PersonAppearance[],
}

export interface SearchHistoryEntryListener {
  (entry: SearchHistoryEntry[]) : void;
}

const listeners: SearchHistoryEntryListener[] = [];

export function onSearchHistoryEntry(listener: SearchHistoryEntryListener): void {
  listeners.push(listener);
}

export function addSearchHistoryEntry(entry: SearchHistoryEntry): void {
  entry.timestamp = new Date();

  const existingHistory = getSearchHistory();

  const entryData = unpick(entry, "timestamp");

  const history = [
    entry,
    ...existingHistory.filter((existingEntry) => {
      return !isEqual(entryData, unpick(existingEntry, "timestamp"));
    })
  ].slice(0, 50);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  listeners.forEach((listener) => listener([ ...history ]));
}

export function getSearchHistory(): SearchHistoryEntry[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(!raw) {
    return [];
  }

  let history;
  try {
    history = JSON.parse(raw) as SearchHistoryEntry[];
  }
  catch(error) {
    console.error("Invalid values (non-JSON) in local storage for search history --- cleaning up!");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return [];
  }

  return history.filter((entry) => entry.timestamp);
}

export function getLatestSearchQuery() {
  const latestSearch = getSearchHistory().find(item => item.type === "search_result");
  if(latestSearch) {
    return { ...latestSearch.query, index: latestSearch.index.join(",") };
  }
  return { query: "" };
}

function unpick(obj, key) {
  const result = {};
  Object.keys(obj)
    .filter((objKey) => objKey != key)
    .forEach((objKey) => result[objKey] = obj[objKey]);
  return result;
}
