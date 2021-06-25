import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile.component.html'
})

export class UserProfilePage {
  constructor(public auth: AuthService, private elasticsearch: ElasticsearchService) { }
  isEditingProfile:boolean = true;

  get config() {
    return window["lls"];
  };

  editProfile() {
    this.isEditingProfile = true;
  };

  logout(){
    console.log('lolle', this.lolle);
    this.auth.logout();
  };

  // get ratedLifeCources() {
    
  // }
  
  featherSpriteUrl = this.config.featherIconPath;
  ratedLifeCourseIds = ['3144356', '3220520'];
  ratedLifeCourses = [];
  lolle = this.elasticsearch.seachLifecourses(this.ratedLifeCourseIds);
  
  // console.log('lolle', lolle);
  // getRatedLifeCourse() {
  //   lolle.subscribe(next =>
  //     ratedLifeCourses = next; 
  //   );  
  // }

  lol = [
    {
      "type": "lifecourses",
      "life_course_id": "3220520",
      "pas": [
        {
          "birthyear_display": "1784",
          "household_position": null,
          "occupation": "Gaardmand",
          "birthyear_sortable": 1784,
          "maiden_patronyms": null,
          "household_family_no": "77",
          "county": "sorø",
          "transcription_code": "b5569",
          "name_searchable": [
            "lars larsen"
          ],
          "full_address": "Bistrup   ",
          "sourceplace_display": "fodby, øster flakkebjerg herred, Danmark amt",
          "role_display": "Husfader",
          "birth_year": "1784",
          "first_names_sortable": "larsen",
          "maiden_family_names": null,
          "transcription_id": "376",
          "event_type": "census",
          "parish": "fodby",
          "age_clean": "56.0",
          "source_year": "1840",
          "id": "3-884860",
          "transcriber_comments": null,
          "deathyear_searchable_fz": null,
          "all_possible_patronyms": [
            "laursen"
          ],
          "birthname_searchable_fz": [],
          "name_searchable_fz": "lars larsen laurs laursen",
          "deathyear_searchable": null,
          "birth_place_county": null,
          "birth_place_koebstad_std": null,
          "source_type_wp4": "census",
          "source_type_display": "Folketælling",
          "birth_place": null,
          "lastname_searchable": "larsen",
          "gender_std": "m",
          "birthyear_searchable": 1784,
          "birthplace_display": "",
          "birth_place_parish_std": null,
          "uncat_names": null,
          "marital_status_std": "gift",
          "land_register_address": null,
          "state_region": "Danmark",
          "birth_place_koebstad": null,
          "lastname_searchable_fz": "larsen laursen",
          "sourceplace_searchable": [
            "sorø",
            "øster flakkebjerg",
            "Danmark",
            "fodby"
          ],
          "district": "øster flakkebjerg",
          "birthyear_searchable_fz": [
            1781,
            1782,
            1783,
            1784,
            1785,
            1786,
            1787
          ],
          "name": "Lars Larsen",
          "source_year_searchable_fz": [
            1837,
            1838,
            1839,
            1840,
            1841,
            1842,
            1843
          ],
          "family_names_sortable": "larsen",
          "household_position_std": "husfader",
          "land_register": null,
          "patronyms": [
            "laursen"
          ],
          "family_names": null,
          "role": "husfader",
          "gender": "M",
          "marital_status_clean": "gift",
          "birthplace_searchable_fz": [],
          "event_year_display": "1840",
          "source_archive_display": "Rigsarkivet",
          "pa_entry_permalink_wp4": null,
          "birth_place_clean": null,
          "deathyear_display": null,
          "source_reference": "11",
          "hh_id": "163216",
          "all_possible_family_names": null,
          "birthname_searchable": [],
          "event_year_wp4": "1840",
          "name_std": "laurs laursen",
          "birth_place_island": null,
          "gender_clean": "m",
          "birth_place_county_std": null,
          "birthplace_searchable": [],
          "birth_place_district": null,
          "birth_place_place": null,
          "occupation_display": "Gaardmand",
          "birth_place_other": null,
          "name_clean": "lars larsen",
          "place_name": "Bistrup",
          "address": null,
          "last_updated_wp4": "2021-03-30",
          "gender_searchable": "mand",
          "firstnames_searchable_fz": "larsen laurs",
          "birth_place_town": null,
          "source_year_searchable": 1840,
          "parish_type": "Sogn",
          "marital_status": "Gift",
          "first_names": [
            "laurs"
          ],
          "source_year_display": 1840,
          "firstnames_searchable": "larsen",
          "name_display": "lars larsen",
          "event_type_display": "Folketælling",
          "birth_place_parish": null,
          "source_id": "3",
          "pa_id": "884860",
          "age": "56"
        },
        {
          "birthyear_display": "1785",
          "household_position": null,
          "occupation": "Gaardmand",
          "birthyear_sortable": 1785,
          "maiden_patronyms": null,
          "household_family_no": "74",
          "county": "sorø",
          "transcription_code": "b4004",
          "name_searchable": [
            "lars larsen"
          ],
          "full_address": "Bidstrup Bye en Gaard  ",
          "sourceplace_display": "fodby, øster flakkebjerg herred, Danmark amt",
          "role_display": "Husfader",
          "birth_year": "1785",
          "first_names_sortable": "larsen",
          "maiden_family_names": null,
          "transcription_id": "793",
          "event_type": "census",
          "parish": "fodby",
          "age_clean": "60.0",
          "source_year": "1845",
          "id": "4-981811",
          "transcriber_comments": null,
          "deathyear_searchable_fz": null,
          "all_possible_patronyms": [
            "laursen"
          ],
          "birthname_searchable_fz": [],
          "name_searchable_fz": "lars larsen laurs laursen",
          "deathyear_searchable": null,
          "birth_place_county": "sorø",
          "birth_place_koebstad_std": null,
          "source_type_wp4": "census",
          "source_type_display": "Folketælling",
          "birth_place": "Fodbye Sogn Sorø Amt",
          "lastname_searchable": "larsen",
          "gender_std": "m",
          "birthyear_searchable": 1785,
          "birthplace_display": "fodbye sogn, sorø",
          "birth_place_parish_std": "fodby",
          "uncat_names": null,
          "marital_status_std": "gift",
          "land_register_address": "en Gaard",
          "state_region": "Danmark",
          "birth_place_koebstad": null,
          "lastname_searchable_fz": "larsen laursen",
          "sourceplace_searchable": [
            "sorø",
            "øster flakkebjerg",
            "Danmark",
            "fodby"
          ],
          "district": "øster flakkebjerg",
          "birthyear_searchable_fz": [
            1782,
            1783,
            1784,
            1785,
            1786,
            1787,
            1788
          ],
          "name": "Lars Larsen",
          "source_year_searchable_fz": [
            1842,
            1843,
            1844,
            1845,
            1846,
            1847,
            1848
          ],
          "family_names_sortable": "larsen",
          "household_position_std": "husfader",
          "land_register": null,
          "patronyms": [
            "laursen"
          ],
          "family_names": null,
          "role": "husfader",
          "gender": null,
          "marital_status_clean": "gift",
          "birthplace_searchable_fz": [
            "fodbye",
            "sorø",
            "Fodbye Sogn Sorø Amt",
            "fodby"
          ],
          "event_year_display": "1845",
          "source_archive_display": "Rigsarkivet",
          "pa_entry_permalink_wp4": null,
          "birth_place_clean": null,
          "deathyear_display": null,
          "source_reference": "29",
          "hh_id": "177262",
          "all_possible_family_names": null,
          "birthname_searchable": [],
          "event_year_wp4": "1845",
          "name_std": "laurs laursen",
          "birth_place_island": null,
          "gender_clean": null,
          "birth_place_county_std": "sorø",
          "birthplace_searchable": [
            "fodbye",
            "sorø",
            "Fodbye Sogn Sorø Amt"
          ],
          "birth_place_district": null,
          "birth_place_place": null,
          "occupation_display": "Gaardmand",
          "birth_place_other": null,
          "name_clean": "lars larsen",
          "place_name": "Bidstrup Bye",
          "address": null,
          "last_updated_wp4": "2021-03-30",
          "gender_searchable": "mand",
          "firstnames_searchable_fz": "larsen laurs",
          "birth_place_town": null,
          "source_year_searchable": 1845,
          "parish_type": "Sogn",
          "marital_status": "Gift",
          "first_names": [
            "laurs"
          ],
          "source_year_display": 1845,
          "firstnames_searchable": "larsen",
          "name_display": "lars larsen",
          "event_type_display": "Folketælling",
          "birth_place_parish": "fodbye",
          "source_id": "4",
          "pa_id": "981811",
          "age": "60"
        },
        {
          "birthyear_display": "1785",
          "household_position": null,
          "occupation": "gaardmand, huusfader",
          "birthyear_sortable": 1785,
          "maiden_patronyms": null,
          "household_family_no": "2",
          "county": "sorø",
          "transcription_code": "b2855",
          "name_searchable": [
            "lars larsen"
          ],
          "full_address": "Bidstrup   ",
          "sourceplace_display": "fodby, øster flakkebjerg herred, Danmark amt",
          "role_display": "Husfader",
          "birth_year": "1785",
          "first_names_sortable": "larsen",
          "maiden_family_names": null,
          "transcription_id": "8",
          "event_type": "census",
          "parish": "fodby",
          "age_clean": "65.0",
          "source_year": "1850",
          "id": "5-955306",
          "transcriber_comments": null,
          "deathyear_searchable_fz": null,
          "all_possible_patronyms": [
            "laursen"
          ],
          "birthname_searchable_fz": [],
          "name_searchable_fz": "lars larsen laurs laursen",
          "deathyear_searchable": null,
          "birth_place_county": "sorø",
          "birth_place_koebstad_std": null,
          "source_type_wp4": "census",
          "source_type_display": "Folketælling",
          "birth_place": "her i sognet",
          "lastname_searchable": "larsen",
          "gender_std": "m",
          "birthyear_searchable": 1785,
          "birthplace_display": "fodby sogn, øster flakkebjerg, sorø",
          "birth_place_parish_std": "fodby",
          "uncat_names": null,
          "marital_status_std": "gift",
          "land_register_address": null,
          "state_region": "Danmark",
          "birth_place_koebstad": null,
          "lastname_searchable_fz": "larsen laursen",
          "sourceplace_searchable": [
            "sorø",
            "øster flakkebjerg",
            "Danmark",
            "fodby"
          ],
          "district": "øster flakkebjerg",
          "birthyear_searchable_fz": [
            1782,
            1783,
            1784,
            1785,
            1786,
            1787,
            1788
          ],
          "name": "Lars Larsen",
          "source_year_searchable_fz": [
            1847,
            1848,
            1849,
            1850,
            1851,
            1852,
            1853
          ],
          "family_names_sortable": "larsen",
          "household_position_std": "husfader",
          "land_register": null,
          "patronyms": [
            "laursen"
          ],
          "family_names": null,
          "role": "husfader",
          "gender": "M",
          "marital_status_clean": "gift",
          "birthplace_searchable_fz": [
            "sorø",
            "øster flakkebjerg",
            "her i sognet",
            "fodby"
          ],
          "event_year_display": "1850",
          "source_archive_display": "Rigsarkivet",
          "pa_entry_permalink_wp4": null,
          "birth_place_clean": null,
          "deathyear_display": null,
          "source_reference": "1",
          "hh_id": "180913",
          "all_possible_family_names": null,
          "birthname_searchable": [],
          "event_year_wp4": "1850",
          "name_std": "laurs laursen",
          "birth_place_island": null,
          "gender_clean": "m",
          "birth_place_county_std": "sorø",
          "birthplace_searchable": [
            "sorø",
            "øster flakkebjerg",
            "her i sognet",
            "fodby"
          ],
          "birth_place_district": "øster flakkebjerg",
          "birth_place_place": null,
          "occupation_display": "gaardmand, huusfader",
          "birth_place_other": null,
          "name_clean": "lars larsen",
          "place_name": "Bidstrup",
          "address": null,
          "last_updated_wp4": "2021-03-30",
          "gender_searchable": "mand",
          "firstnames_searchable_fz": "larsen laurs",
          "birth_place_town": null,
          "source_year_searchable": 1850,
          "parish_type": "Sogn",
          "marital_status": "Gift",
          "first_names": [
            "laurs"
          ],
          "source_year_display": 1850,
          "firstnames_searchable": "larsen",
          "name_display": "lars larsen",
          "event_type_display": "Folketælling",
          "birth_place_parish": "fodby",
          "source_id": "5",
          "pa_id": "955306",
          "age": "65"
        },
        {
          "birthyear_display": "1787",
          "BirthPlace": "Odby Sogn",
          "birthyear_sortable": null,
          "maiden_patronyms": null,
          "EventYear": "1853",
          "bpl_country": null,
          "GivenName": "Lars",
          "name_searchable": "Lars Lars",
          "EventPlace": null,
          "sourceplace_display": "Vester Bjerregrav Sogn",
          "role_display": "",
          "birth_year": "1787",
          "first_names_sortable": "Lars",
          "maiden_family_names": null,
          "event_type": "burial",
          "age_clean": "66.0",
          "GivenNameAlias": null,
          "bpl_parish": "odby",
          "NameSuffix": null,
          "id": "11-2283663",
          "date_of_event": "1853-04-20",
          "deathyear_searchable_fz": null,
          "BirthYear": null,
          "all_possible_patronyms": "laursen",
          "BirthMonth": null,
          "name_searchable_fz": "Lars Lars laurs laursen",
          "deathyear_searchable": null,
          "source_type_wp4": "parish",
          "source_type_display": "Kirkebog",
          "lastname_searchable": "Lars",
          "gender_std": "m",
          "birthyear_searchable": null,
          "birthplace_display": "odby sogn, odby sogn",
          "uncat_names": null,
          "EventDay": "20",
          "bpl_place": null,
          "lastname_searchable_fz": "Lars laursen",
          "sourceplace_searchable": [
            "Vester Bjerregrav Sogn",
            "Danmark"
          ],
          "birthyear_searchable_fz": null,
          "source_year_searchable_fz": null,
          "EventCountry": "Danmark",
          "family_names_sortable": "Lars",
          "patronyms": "laursen",
          "family_names": null,
          "role": null,
          "gender": null,
          "birthplace_searchable_fz": [
            "odby",
            "Odby Sogn",
            "odby sogn"
          ],
          "event_year_display": "1853",
          "source_archive_display": "Rigsarkivet",
          "date_of_birth": null,
          "BrowseLevel2": "1853-1869",
          "EventAge": "66",
          "BrowseLevel1": "Vester Bjerregrav Sogn",
          "pa_entry_permalink_wp4": null,
          "deathyear_display": "1853",
          "all_possible_family_names": null,
          "event_year_wp4": "1853",
          "name_std": "laurs laursen",
          "EventMonth": "april",
          "birthplace_searchable": [
            "odby",
            "odby sogn"
          ],
          "EventCounty": null,
          "BrowseLevel": "Viborg Amt",
          "occupation_display": "",
          "bpl": "odby sogn",
          "NamePrefix": null,
          "EventState": null,
          "SurnameAlias": null,
          "last_updated_wp4": "2021-03-30",
          "event_persons": "1",
          "gender_searchable": "mand",
          "firstnames_searchable_fz": "laurs Lars",
          "BirthDay": null,
          "main_person_id": "2283663",
          "source_year_searchable": null,
          "bpl_foreign_place": null,
          "first_names": "laurs",
          "event_id": "954502",
          "bpl_county": null,
          "source_year_display": "1853-1869",
          "EventParish": "Vester Bjerregrav Sogn",
          "firstnames_searchable": "Lars",
          "name_display": "Lars Lars",
          "event_type_display": "Begravelse",
          "bpl_town": null,
          "source_id": "11",
          "Surname": "Lars",
          "pa_id": "2283663"
        }
      ]
    }
  ]

}