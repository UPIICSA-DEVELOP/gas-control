/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {LoaderService} from '@app/core/components/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public show: boolean;

  constructor(
    private _loader: LoaderService
  ) {
    this.show = false;
  }

  ngOnInit() {
    this._loader.getProgress().subscribe(value => {
      this.show = value;
    });
  }

}
