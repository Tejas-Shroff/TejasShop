import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { } // Injects the PLATFORM_ID token to determine the platform

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {  // this checks if code is application is running in browser.
      return _window();   // Checks if the code is running in a browser using isPlatformBrowser. If true, it returns the window object.
    }   // to ensure the window object is only accessed when the code is running in a browser environment
  }
}