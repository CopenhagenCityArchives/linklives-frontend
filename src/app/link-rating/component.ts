import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


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

  linkOptions = [
    {
      title: "Ja, det er troværdigt",
      numberOfAnswers: 5,
      chosen: true,
      options: [
        {
          label: "ja det ser fornuftigt ud - personinfo passer sammen.",
          value: 1,
        },
        {
          label: "Jeg kan genkende personinfo fra andre kilder, der endnu ikke er med i Link-Lives.",
          value: 2,
        },
        {
          label: "Jeg ved det fra min private slægtsforskning.",
          value: 3,
        }
      ]
    },
    {
      title: "Nej, det er ikke troværdigt",
      numberOfAnswers: 2,
      chosen: false,
      options: [
        {
          label: "Det ser helt forkert ud - personinfo passer ikke sammen.",
          value: 4,
        },
        {
          label: "Jeg ved det er forkert fra andre kilder, der endnu ikke er med i Link-Lives.",
          value: 5,
        },
        {
          label: "Jeg ved det er forkert fra min private slægtsforskning",
          value: 6,
        }
      ]
    },
    {
      title: "Måske",
      numberOfAnswers: 4,
      chosen: false,
      options: [
        {
          label: "Jeg er i tvivl om persondata passer sammen",
          value: 7,
        },
      ]
    }
  ]

  numberOfRatings = 11;

  percent(numberOfAnswers) {
    return Math.round(parseInt(numberOfAnswers) / this.numberOfRatings * 100);
  }

  linkRatingForm = new FormGroup({
    option: new FormControl(''),
  });

  onSubmit() {
    console.log("chosen option:", this.linkRatingForm.value.option);
    this.showForm = false;
  }

  closeLinkRating() {
    this.showForm = true;
    this.close.emit(null);
  }

  ngOnInit(): void {
  }

  closeOnEsc() {
    // Close sidebar on escape keypress
    if(this.openLinkRating) {
      this.closeLinkRating();
    }
  }
}
