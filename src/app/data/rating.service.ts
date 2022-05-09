import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

export interface RatingOption {
  id: number,
  text: string,
  heading: string,
}

export interface LinkRatingOptionsResult {
  [index: number]: RatingOption;
}

export interface Option {
  value: number,
  label: string,
}

export interface LinkRatingCategegory {
  category: string,
  options: Option[]
}
export interface LinkRatingOptions {
  [index: number]: LinkRatingCategegory;
}

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  getRatedLifecourses(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/ratings/lifecourses`);
  }

  getLinkRatingOptions(): Observable<LinkRatingOptions> {
    return new Observable<LinkRatingOptions>(    
      observer => {
        this.http.get<LinkRatingOptionsResult>(`${environment.apiUrl}/ratingOptions`)
        .subscribe(responseBody => {
          try {
            const linkRatingOptions = [];

            for (const optionFromResult of responseBody as any) {
              const category = optionFromResult.heading;

              let index = linkRatingOptions.findIndex((option) => option.category == category);

              if(index == -1) {
                const ratingCateogory = {
                  category: optionFromResult.heading,
                  chosen: false,
                  options: []
                }
                linkRatingOptions.push(ratingCateogory);
                index = linkRatingOptions.length -1;
              }

              const option = {
                label: optionFromResult.text,
                value: optionFromResult.id
              }
              linkRatingOptions[index].options.push(option);
            }

            observer.next(linkRatingOptions);
          } catch (error) {
            observer.error(error);
          }
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      }
    )
  }

  sendLinkRating(linkRating: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/LinkRating`, linkRating);
  }

  getLinkRatingStats(id: string): Observable<{ headingRatings: any, categoryRatings: object, totalRatings: number, ratedBy: string[] }> {
    return this.http.get<any>(`${environment.apiUrl}/Link/${id}/ratings`)
      .pipe(map(((ratings) => {
        const headingRatings = {};
        const categoryRatings = {}

        ratings.forEach((entry) => {
          if(!headingRatings[entry.rating.heading]) {
            headingRatings[entry.rating.heading] = 0;
          }
          if(!categoryRatings[entry.rating.category]) {
            categoryRatings[entry.rating.category] = 0;
          }
          headingRatings[entry.rating.heading]++;
          categoryRatings[entry.rating.category]++;
        });

        return {
          headingRatings,
          categoryRatings,
          totalRatings: ratings.length,
          ratedBy: ratings.map((entry) => entry.user),
        }
      })));
  }
}