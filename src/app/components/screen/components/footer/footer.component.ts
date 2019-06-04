/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '@env/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

  public version: string;
  public url: string;

  constructor() {
    this.version = environment.VERSION;
    this.url = environment.url
  }

  ngOnInit() {
  }

}
