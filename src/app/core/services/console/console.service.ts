/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
declare var figlet;

@Injectable()
export class ConsoleService {

  constructor (
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
  }


  public init(): Promise<void> {
    return new Promise<void>(resolve => {
      if(isPlatformBrowser(this._platformId)){
        //const figlet = require('figlet');
        const ready = () => {
          figlet('MapLander', 'Doh', function(err, text) {
            if (err) {
              console.log('something went wrong...');
              console.dir(err);
              return;
            }
            console.log(text);
            console.log('We thought you would never do it 🤨, but this option is exclusive for developers, we recommend you do not modify anything. 😉')
          });
        };
        figlet.defaults({fontPath: "assets"});
        figlet.preloadFonts(["Doh"], ready);
      }
      resolve();
    });
  }

}
