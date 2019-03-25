/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-sgm',
  templateUrl: './sgm.component.html',
  styleUrls: ['./sgm.component.scss']
})
export class SgmComponent implements OnInit {

  constructor(
    private _matDialogRef: MatDialogRef<SgmComponent>
  ) { }

  ngOnInit() {
  }

  public close():void{
    this._matDialogRef.close();
  }

}
