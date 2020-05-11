import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonalAppearance } from '../search/search.service';

@Component({
  selector: 'app-personal-appearance',
  templateUrl: './personal-appearance.component.html',
  styleUrls: ['./personal-appearance.component.scss']
})
export class PersonalAppearanceComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  data;
  pa: PersonalAppearance

  ngOnInit(): void {
    console.log("Hi from pa");

    this.route.data.subscribe((resolve) => {
      console.log(resolve);
      this.data = resolve;
      this.pa = resolve.pa._source.personal_appearance;

      console.log("FROM PA COMPONENT");
      console.log(this.data);
      console.log(this.pa);
    });
  }



}
