import isEqual from 'lodash.isequal';
import { AdvancedSearchQuery, PersonAppearance, SourceIdentifier } from './search/search.service';

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
  sourceFilter?: SourceIdentifier[],
  index?: string[],
  lifecourse?: LifecourseSearchHistoryEntry,
  personAppearance?: PersonAppearance,
  timestamp?: Date,
  pagination?: SearchResultPagination,
  sort?: SearchResultSorting,
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

  const entryData = unpick(entry, "timestamp", "pagination", "sort", "sourceFilter");

  const history = [
    entry,
    ...existingHistory.filter((existingEntry) => {
      return !isEqual(entryData, unpick(existingEntry, "timestamp", "pagination", "sort", "sourceFilter"));
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

    if(entry.sourceFilter) {
      queryParams = {
        ...queryParams,
        sourceFilter: entry.sourceFilter
          .map(({ event_type, source_year }) => `${event_type}_${source_year}`)
          .join(",")
      };
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
