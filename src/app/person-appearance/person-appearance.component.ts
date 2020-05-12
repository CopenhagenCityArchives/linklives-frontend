import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';

@Component({
  selector: 'app-person-appearance',
  templateUrl: './person-appearance.component.html',
  styleUrls: ['./person-appearance.component.scss']
})
export class PersonAppearanceComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  pa: PersonAppearance 

  ngOnInit(): void {
    console.log("Hi from pa");

    this.route.data.subscribe((resolve) => {
      this.pa = resolve.pa as PersonAppearance;
    });
  }



}
