import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { SearchResult } from '../search/search.service';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {

  searchResult: SearchResult;
  query?: string;
  index: string;

  pagination: { current: number, last: number, size: number, navigationPages: number[]; }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParamMap => {
      this.query = queryParamMap.get('query');
      this.index = queryParamMap.get('index');
    });

    this.route.data.subscribe((data: { searchResult: SearchResult }) => {
      this.searchResult = data.searchResult;
      this.searchResult = {
        took: 3,
        totalHits: 3,
        indexHits: {
          lifeCourses: 1,
          pas: 2,
          links: 5
        },
        hits: [
        {
          type: "pas",
          pa: {
            pa_id: 1,
            source_id: 1,
            løbenr_i_indtastning: 1, 
            Stednavn: 'Stednavn 1', 
            name: 'name 1', 
            age: 1, 
            Erhverv: 'Erhverv 1', 
            Stilling_i_husstanden: 'Stilling_i_husstanden 1', 
            birth_place: 'birth_place 1', 
            gender: 'gender 1', 
            Sogn: 'Sogn 1', 
            Amt: 'Amt 1', 
            Herred: 'Herred 1', 
            gender_clean: 'gender_clean 1', 
            name_clean: 'name_clean 1', 
            age_clean: 1, 
            hh_id: 1, 
            hh_pos_std: 'hh_pos_std 1', 
            is_husband: true, 
            has_husband: false, 
            name_std: 'name_std 1', 
            maiden_family_names: 'maiden_family_names 1', 
            maiden_patronyms: 'maiden_patronyms 1', 
            first_names: 'first_names 1', 
            patronyms: 'patronyms 1', 
            family_names: 'family_names 1', 
            uncat_names: 'uncat_names 1', 
            husband_first_names: 'husband_first_names 1', 
            husband_name_match: false, 
            true_patronym: 'true_patronym 1', 
            all_possible_patronyms: 'all_possible_patronyms 1', 
            all_possible_family_names: 'all_possible_family_names 1', 
            b_place_cl: 'b_place_cl 1', 
            other_cl: 'other_cl 1', 
            parish_cl: 'parish_cl 1', 
            district_cl: 'district_cl 1', 
            county_cl: 'county_cl 1', 
            koebstad_cl: 'koebstad_cl 1', 
            island_cl: 'island_cl 1', 
            town_cl: 'town_cl 1', 
            place_cl: 'place_cl 1', 
            county_std: 'county_std 1', 
            parish_std: 'parish_std 1'
          }
        }, {
        type: "pas",
        pa: {
          pa_id: 2,
          source_id: 2,
          løbenr_i_indtastning: 2, 
          Stednavn: 'Stednavn 2', 
          name: 'name 2', 
          age: 2, 
          Erhverv: 'Erhverv 2', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 2', 
          birth_place: 'birth_place 2', 
          gender: 'gender 2', 
          Sogn: 'Sogn 2', 
          Amt: 'Amt 2', 
          Herred: 'Herred 2', 
          gender_clean: 'gender_clean 2', 
          name_clean: 'name_clean 2', 
          age_clean: 2, 
          hh_id: 2, 
          hh_pos_std: 'hh_pos_std 2', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 2', 
          maiden_family_names: 'maiden_family_names 2', 
          maiden_patronyms: 'maiden_patronyms 2', 
          first_names: 'first_names 2', 
          patronyms: 'patronyms 2', 
          family_names: 'family_names 2', 
          uncat_names: 'uncat_names 2', 
          husband_first_names: 'husband_first_names 2', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 2', 
          all_possible_patronyms: 'all_possible_patronyms 2', 
          all_possible_family_names: 'all_possible_family_names 2', 
          b_place_cl: 'b_place_cl 2', 
          other_cl: 'other_cl 2', 
          parish_cl: 'parish_cl 2', 
          district_cl: 'district_cl 2', 
          county_cl: 'county_cl 2', 
          koebstad_cl: 'koebstad_cl 2', 
          island_cl: 'island_cl 2', 
          town_cl: 'town_cl 2', 
          place_cl: 'place_cl 2', 
          county_std: 'county_std 2', 
          parish_std: 'parish_std 2'
        }
      }, {
        type: "lifecourses",
        life_course_id: 1,
        pas: [{ 
          pa_id: 1,
          source_id: 1,
          løbenr_i_indtastning: 1, 
          Stednavn: 'Stednavn 1', 
          name: 'name 1', 
          age: 1, 
          Erhverv: 'Erhverv 1', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 1', 
          birth_place: 'birth_place 1', 
          gender: 'gender 1', 
          Sogn: 'Sogn 1', 
          Amt: 'Amt 1', 
          Herred: 'Herred 1', 
          gender_clean: 'gender_clean 1', 
          name_clean: 'name_clean 1', 
          age_clean: 1, 
          hh_id: 1, 
          hh_pos_std: 'hh_pos_std 1', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 1', 
          maiden_family_names: 'maiden_family_names 1', 
          maiden_patronyms: 'maiden_patronyms 1', 
          first_names: 'first_names 1', 
          patronyms: 'patronyms 1', 
          family_names: 'family_names 1', 
          uncat_names: 'uncat_names 1', 
          husband_first_names: 'husband_first_names 1', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 1', 
          all_possible_patronyms: 'all_possible_patronyms 1', 
          all_possible_family_names: 'all_possible_family_names 1', 
          b_place_cl: 'b_place_cl 1', 
          other_cl: 'other_cl 1', 
          parish_cl: 'parish_cl 1', 
          district_cl: 'district_cl 1', 
          county_cl: 'county_cl 1', 
          koebstad_cl: 'koebstad_cl 1', 
          island_cl: 'island_cl 1', 
          town_cl: 'town_cl 1', 
          place_cl: 'place_cl 1', 
          county_std: 'county_std 1', 
          parish_std: 'parish_std 1'
        }, {
          pa_id: 2,
          source_id: 2,
          løbenr_i_indtastning: 2, 
          Stednavn: 'Stednavn 2', 
          name: 'name 2', 
          age: 2, 
          Erhverv: 'Erhverv 2', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 2', 
          birth_place: 'birth_place 2', 
          gender: 'gender 2', 
          Sogn: 'Sogn 2', 
          Amt: 'Amt 2', 
          Herred: 'Herred 2', 
          gender_clean: 'gender_clean 2', 
          name_clean: 'name_clean 2', 
          age_clean: 2, 
          hh_id: 2, 
          hh_pos_std: 'hh_pos_std 2', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 2', 
          maiden_family_names: 'maiden_family_names 2', 
          maiden_patronyms: 'maiden_patronyms 2', 
          first_names: 'first_names 2', 
          patronyms: 'patronyms 2', 
          family_names: 'family_names 2', 
          uncat_names: 'uncat_names 2', 
          husband_first_names: 'husband_first_names 2', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 2', 
          all_possible_patronyms: 'all_possible_patronyms 2', 
          all_possible_family_names: 'all_possible_family_names 2', 
          b_place_cl: 'b_place_cl 2', 
          other_cl: 'other_cl 2', 
          parish_cl: 'parish_cl 2', 
          district_cl: 'district_cl 2', 
          county_cl: 'county_cl 2', 
          koebstad_cl: 'koebstad_cl 2', 
          island_cl: 'island_cl 2', 
          town_cl: 'town_cl 2', 
          place_cl: 'place_cl 2', 
          county_std: 'county_std 2', 
          parish_std: 'parish_std 2'
        }]
      }]
    }

      console.warn('heh', this.searchResult);

      this.route.paramMap.subscribe(paramMap => {
        // page defaults to 1
        let page = Number(paramMap.get('page'));
        if (page < 1 || page == NaN) {
          page = 1;
        }

        let size = Number(paramMap.get('size'));
        if (size < 1 ||page == NaN) {
          size = 10;
        }
        
        let pageStart = Math.max(1, page - 2);
        let totalPages = Math.ceil(this.searchResult.totalHits / size);
        let pageEnd = Math.min(pageStart + 4, totalPages);

        // if there are less than two pages after current, expand pagination
        // in the lower direction
        if (pageEnd - page < 2) {
          pageStart = Math.max(1, pageEnd - 4);
        }

        this.pagination = {
          current: page,
          last: pageEnd,
          size: size,
          navigationPages: []
        }

        for (let page = pageStart; page <= pageEnd; page ++) {
          this.pagination.navigationPages.push(page);
        }
      });
    });
  }

}
