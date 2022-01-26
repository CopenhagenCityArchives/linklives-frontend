import { NgModule } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

type GoogleAnalyticsFunction = (command: string, field: string, other?: any) => void;
type WindowWithGoogleAnalytics = Window & typeof globalThis & {
  ga: GoogleAnalyticsFunction,
};

@NgModule()
export class AnalyticsModule {
  constructor(private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          // Google Analytics has not been set on `window` on first request,
          // so we need to guard it and make sure it exists before we send off
          // a pageview to Google Analytics
          const ga = (window as WindowWithGoogleAnalytics).ga;
          if(ga) {
            ga('set', 'page', `${location.pathname}${location.search}${location.hash}`);
            ga('send', 'pageview');
          }
        },
      });
  }
}
