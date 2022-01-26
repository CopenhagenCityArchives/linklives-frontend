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
    const ga = (window as WindowWithGoogleAnalytics).ga;
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          console.log("has ga?", ga);
          const ga2 = (window as WindowWithGoogleAnalytics).ga;
          console.log("ga late?", ga2);
          console.log("url", event.url);
          //TODO: should we set prefix on url as we are on a subpage?
          ga2('set', 'page', event.url);
          ga2('send', 'pageview');
        },
      });
  }
}
