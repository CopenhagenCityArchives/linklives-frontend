import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';


@Component({
  selector: 'app-link-rating',
  templateUrl: './component.html',
  host: {
    '(document:keyup.escape)': 'closeOnEsc()'
  }
})

export class LinkRatingComponent implements OnInit {
  @Input() openLinkRating: boolean;
  @Input() featherIconPath: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  ratingOptions;
  totalRatings = 11;
  chosen: string;
  numberOfAnswers;

  percent(category) {
    const currentNumberOfAnswers = this.numberOfAnswers[category];
    return Math.round(parseInt(currentNumberOfAnswers) / this.totalRatings * 100);
  }

  linkRatingForm = new FormGroup({
    option: new FormControl(''),
  });

  onSubmit() {
    const chosenOption = this.linkRatingForm.value.option;
    // update api
    const ratingOption = this.ratingOptions.find(optionCategory => optionCategory.options.some(option => option.value == chosenOption));
    this.chosen = ratingOption.category;
    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.ratingOptions = this.ratingOptions.map(option => ({...option, chosen: false}));
    this.close.emit(null);
  }

  fillNumerOfAnswers() {
    // something like this should be done after fetching link rating data
    let i = 2;
    this.numberOfAnswers = {};
    for (const optionCategory of this.ratingOptions as any) {
      const category = optionCategory.category;
      i += 2;
      this.numberOfAnswers[category] = i;
    }
  }

  ngOnInit(): void {
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }

  constructor(private elasticsearch: ElasticsearchService) {
    this.elasticsearch.getLinkRatingOptions().subscribe(
      ratingOptions => {  
      this.ratingOptions = ratingOptions;
      this.fillNumerOfAnswers();
      });
  }  
}
