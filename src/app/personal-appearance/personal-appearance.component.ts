import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-personal-appearance',
  templateUrl: './personal-appearance.component.html',
  styleUrls: ['./personal-appearance.component.scss']
})
export class PersonalAppearanceComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance 

  ngOnInit(): void {
    console.log("Hi from pa");

    this.route.data.subscribe((resolve) => {
      this.pa = resolve.pa as PersonAppearance;

      console.log("FROM PA COMPONENT");
      console.log(this.pa);
    });
  }



}
