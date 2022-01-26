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
          const ga = (window as WindowWithGoogleAnalytics).ga;
          console.log("ga later?", ga);
          console.log("url", event.url, location.pathname, location.search, location.hash, `${location.pathname}${location.search}${location.hash}`);
          //TODO: should we set prefix on url as we are on a subpage?
          if(ga) {
            console.log("ga loaded");
            ga('set', 'page', `${location.pathname}${location.search}${location.hash}`);
            ga('send', 'pageview');
          }
          else {
            console.log("no ga loaded", ga);
          }
        },
      });
  }
}
