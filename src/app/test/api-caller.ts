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
    "ratingId": 1,
    "linkKey": "1.100006_0.70809",
    "user": "Lone123UserId"
  }

  ngOnInit(): void {
    this.auth.user$
    .pipe(
      concatMap((user) =>
        // Use HttpClient to make the call
        {
          return this.http.post<any>(
            //${user.sub}
            `${environment.apiUrl}/LinkRating`, this.rating
          )
        }
      )
    )
    .subscribe(next => console.log('next', next));
  }
}