/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from 'environments/environment';

@Injectable()
export class IconsService {

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry) {
  }

  public init(): Promise<void> {
    return new Promise<void>(resolve => {
      this.matIconRegistry.addSvgIconSetInNamespace('icons',
        this.domSanitizer.bypassSecurityTrustResourceUrl(environment.url + 'assets/icons.svg'));
      resolve();
    });
  }

}
