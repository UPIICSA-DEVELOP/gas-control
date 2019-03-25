/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-sasisopa',
  templateUrl: './sasisopa.component.html',
  styleUrls: ['./sasisopa.component.scss']
})
export class SasisopaComponent implements OnInit {

  constructor(
    private _matDialogRef: MatDialogRef<SasisopaComponent>
  ) { }

  ngOnInit() {

  }

  public close():void{
    this._matDialogRef.close();
  }

}
