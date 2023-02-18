'use strict';

import { API } from './api.js';
import { LS, fuctionalityStatus } from './constants.js';

console.log('Vscan - Content Script Injected');
var oldHref = document.location.href;

async function activateExtensionFunction() {
  console.log('Vscan - Activated Extension Function');
  let COUNTER_total_video_scanned = await LS.getItem('COUNTER_total_video_scanned');
  if (document.location.href.includes("/watch?")) {
    console.log('Scanning Video');
    COUNTER_total_video_scanned += 1;
    await LS.setItem('COUNTER_total_video_scanned', COUNTER_total_video_scanned);
    //API.scan_video(oldHref);
  }
  window.onload = function () {
    var bodyList = document.querySelector('body');
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(async function (mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href;
          if (oldHref.includes('/watch?')) {
            console.log('Inside watch, next scanning video');
            console.log(oldHref);
            COUNTER_total_video_scanned += 1;
            await LS.setItem('COUNTER_total_video_scanned', COUNTER_total_video_scanned);
            //API.scan_video(oldHref);
          }
        }
      });
    });

    var config = {
      childList: true,
      subtree: true,
    };

    observer.observe(bodyList, config);
  };
}
fuctionalityStatus().then((result) => {
  if (result) activateExtensionFunction();
})
