import { NgModule } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

type GoogleAnalyticsFunction = (command: string, field: string) => void;
type WindowWithGoogleAnalytics = Window & typeof globalThis & {
  ga: GoogleAnalyticsFunction,
};

@NgModule()
export class AnalyticsModule {
  constructor(private router: Router) {
    const ga = (window as WindowWithGoogleAnalytics).ga;
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event) => {
          ga('send', 'pageview');
        },
      });
  }
}
