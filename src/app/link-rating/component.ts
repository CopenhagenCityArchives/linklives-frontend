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
  @Input() linkKey: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  showForm = true;
  linkOptions;
  numberOfRatings = 11;
  chosen: string;
  numberOfAnswers;

  percent(category) {
    const currentNumberOfAnswers = this.numberOfAnswers[category];
    return Math.round(parseInt(currentNumberOfAnswers) / this.numberOfRatings * 100);
  }

  linkRatingForm = new FormGroup({
    option: new FormControl(''),
  });
  someRating = [];
  onSubmit() {
    const chosenRatingId = this.linkRatingForm.value.option;
    const ratingData = {
      ratingId: chosenRatingId,
      linkKey: this.linkKey,
    }

    this.elasticsearch.sendLinkRating(ratingData).subscribe(rate => {
      this.someRating.push(rate)
    });

    // update api
    const linkOption = this.linkOptions.find(optionCategory => optionCategory.options.some(option => option.value == chosenRatingId));
    this.chosen = linkOption.category;
    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.linkOptions = this.linkOptions.map(option => ({...option, chosen: false}));
    this.close.emit(null);
  }

  fillNumerOfAnswers() {
    // something like this should be done after fetching link rating data
    let i = 2;
    this.numberOfAnswers = {};
    for (const optionCategory of this.linkOptions as any) {
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
      linkOptions => {  
      this.linkOptions = linkOptions;
      this.fillNumerOfAnswers();
      });
  }  
}
