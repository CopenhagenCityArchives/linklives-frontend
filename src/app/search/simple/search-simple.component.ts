import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdvancedSearchQuery, EntryCounts } from '../search.service';
import { searchFieldPlaceholders, searchFieldLabels, getFieldOptions, genderOptions } from 'src/app/search-term-values';
import { prettyNumbers } from 'src/app/util/display-helpers';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-search-simple',
  templateUrl: './search-simple.component.html',
})
export class SimpleSearchComponent implements OnInit {
  get config() {
    return window["lls"];
  }

  featherSpriteUrl = this.config.featherIconPath;

  // Simple search
  query = "";

  // Advanced search
  modeFuzzy = false;
  searchFieldPlaceholders = searchFieldPlaceholders;
  searchFieldLabels = searchFieldLabels;

  hardcodedSearchTerms = [
    { field: "firstName", value: "" },
    { field: "lastName", value: "" },
    { field: "birthYear", value: "" },
    { field: "birthPlace", value: "" },
    { field: "deathYear", value: "" },
    { field: "deathPlace", value: "" },
    { field: "sourceYear", value: "" },
    { field: "sourcePlace", value: "" },
  ];

  addedSearchTerms = [];

  personAppearanceCount = 0;
  lifecourseCount = 0;

  indices = {
    pas: { value: true, label: "Personregistrering" },
    lifecourses: { value: true, label: "Livsforløb" },
  };

  get indexKeys() {
    return Object.keys(this.indices);
  }

  get computedIndex() {
    return this.indexKeys
      .filter((key) => this.indices[key].value)
      .join(",") || null;
  }

  get searchTerms() {
    return [ ...this.hardcodedSearchTerms, ...this.addedSearchTerms ];
  }

  get fieldOptions() {
    const isNotUsed = (option) => !this.searchTerms.some((term) => option.value && term.field == option.value);
    return getFieldOptions(isNotUsed);
  }

  get genderOptions() {
    return genderOptions;
  }

  constructor(private router: Router, private elasticSearch: DataService, private elements: ElementRef) { }

  ngOnInit(): void {
    this.elasticSearch.getEntryCounts().subscribe((entryCounts) => {
      this.animateCountIncrease(entryCounts);
    });
  }

  animateCountIncrease(entryCounts: EntryCounts) {
    const personAppearanceCount = entryCounts.indexHits.pas;
    const lifecourseCount = entryCounts.indexHits.lifeCourses;

    const steps = 30;
    const personAppearanceStep = personAppearanceCount / steps;
    const lifecourseStep = lifecourseCount / steps;

    const interval = setInterval(() => {
      if(this.personAppearanceCount == personAppearanceCount && this.lifecourseCount == lifecourseCount) {
        clearInterval(interval);
        return;
      }

      this.personAppearanceCount = Math.min(personAppearanceCount, this.personAppearanceCount + personAppearanceStep);
      this.lifecourseCount = Math.min(lifecourseCount, this.lifecourseCount + lifecourseStep);
    }, 80);
  }

  searchSimple(): void {
    this.router.navigate(['/results'], {
      queryParams: {
        query: this.query,
        index: this.computedIndex,
      },
    });
  }

  clearHardcodedSearchTerm(searchTerm, $event): void {
    $event.preventDefault();
    searchTerm.value = "";
  }

  clearAddedSearchTerm(searchTerm, $event): void {
    $event.preventDefault();
    searchTerm.value = "";
  }

  addField(field) {
    this.addedSearchTerms.push({ field, value: "" });
    setTimeout(() => {
      this.elements.nativeElement.querySelector(`[data-search-term=${field}]`).focus();
    }, 0);
  }

  clearSearchTerms() {
    this.addedSearchTerms = [];
  }

  searchAdvanced(): void {
    const searchParams: AdvancedSearchQuery = {};

    this.searchTerms
      .filter((term) => term.value !== "")
      .forEach((term) => searchParams[term.field] = term.value);

    this.router.navigate(['/results'], {
      queryParams: {
        ...searchParams,
        index: this.computedIndex,
        mode: this.modeFuzzy ? "fuzzy" : "default",
      }
    });
  }

  enhanceText(text: String) {
    return text
      .replace("%PA_COUNT%", prettyNumbers(this.personAppearanceCount, 0))
      .replace("%LIFECOURSE_COUNT%", prettyNumbers(this.lifecourseCount, 0));
  }
}
