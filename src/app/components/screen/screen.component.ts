/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '@app/core/material/material.module';
import {PipesModule} from '@app/core/pipes/pipes.module';
import {ServicesModule} from '@app/core/services/services.module';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit {

  constructor(
    private _material: MaterialModule,
    private _pipes: PipesModule,
    private _services: ServicesModule
  ) { }

  ngOnInit() {
  }

}
