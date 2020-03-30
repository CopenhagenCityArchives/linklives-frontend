import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {

  types: { id: number, name: string }[];
  @Input("field") model: { type: { id: number, name: string }, value: any };

  constructor(private service: SearchService) { }

  ngOnInit(): void {
    let types : { id: number, name: string }[] = [];
    
    this.service.getTypes().subscribe(nextType => {
      types.push(nextType);
    }, null, () => {
      this.types = types;
    });
  }

  setType(event: Event) {
    var select = event.target as HTMLSelectElement;
    this.model.type = this.types.find(type => type.id == Number(select.value));
  }

}
