/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';

@Component({
  selector: 'app-gas-station',
  templateUrl: './gas-station.component.html',
  styleUrls: ['./gas-station.component.scss']
})
export class GasStationComponent implements OnInit {
  public utils: any;
  @Input() public station: any;
  constructor(
    private _api: ApiService
  ) { }

  ngOnInit() {
    this._api.getUtils().subscribe(response=>{
      this.utils=response.item.groupIcons;
    })
  }

}
