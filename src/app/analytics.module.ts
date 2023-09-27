import { NgModule } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

type GoogleAnalyticsFunction = (command: string, field: Record<string,any>|string, other?: any) => void;
type WindowWithGoogleAnalytics = Window & typeof globalThis & {
  gtag: GoogleAnalyticsFunction,
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
          const gtag = (window as WindowWithGoogleAnalytics).gtag;
          if(gtag) {
            gtag('set', { page: `${location.pathname}${location.search}${location.hash}` });
            gtag('event', 'page_view');
          }
        },
      });
  }
}
