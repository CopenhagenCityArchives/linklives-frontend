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
          console.log("has ga?", ga);
          //TODO: should we set prefix on url as we are on a subpage?
          ga('set', 'page', event.url);
          ga('send', 'pageview');
        },
      });
  }
}
