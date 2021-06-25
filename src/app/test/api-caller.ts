import { Component, OnInit } from '@angular/core';
import { concatMap, tap, pluck } from 'rxjs/operators';

// Import the HttpClient for making API requests
import { HttpClient } from '@angular/common/http';

// Import AuthService from the Auth0 Angular SDK to get access to the user
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-metadata',
  template: `hej!
  <div *ngIf="metadata">
    <pre>{{ metadata | json }}</pre>
  </div>`,
  styles: [],
})
export class UserMetadataComponent implements OnInit {
  metadata = {};

  // Inject both AuthService and HttpClient
  constructor(public auth: AuthService, private http: HttpClient) {}

  rating = {
    "rating": {
      "id": 4,
      "text": "looool",
      "heading": "string"
    },
    "rateId": 4,
    "linkKey": "5.955306_4.981811",
    "user": "Lone123UserId"
  }

  ngOnInit(): void {
    this.auth.user$
    .pipe(
      concatMap((user) =>
        // Use HttpClient to make the call
        this.http.post<any>(
          `${environment.apiUrl}/LinkRating/${user.sub}`, this.rating
        )
      )
    )
    .subscribe(next => console.log('next', next));
    //     this.http.get(
          
    //       encodeURI(`https://api.link-lives.dk/${user.sub}`)
    //     )
    //   ),
    //   pluck('user_metadata'),
    //   tap((meta) => (this.metadata = meta))
    // )
    //.subscribe();
  }
}