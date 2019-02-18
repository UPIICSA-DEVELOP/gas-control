/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/core/constants.core';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.40s ease-out', style({ right: '0'  }))
      ]),
      transition(':leave', [
        style({ right: '0'}),
        animate('.40s ease-in', style({ right: '-100%' }))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class ProceduresComponent implements OnInit {
  public procedures: any;
  constructor(
    private _api: ApiService,
    private _route: Router,
    private _pdf: PdfVisorService
  ) {

  }

  ngOnInit() {
    this.getProcedures();
  }

  public onCloseProcedures():void{
    this._route.navigate(['/home']);
  }

  /*
  * TODO: Implements pdf visor after first launch
  * */
  public openFile(file:any):void{
    this._pdf.open({file: file, url: file, notIsUrl: false});
  }

  private getProcedures():void{
    this._api.getUtils().subscribe(response=>{
      switch (response.code){
        case 200:
          this.procedures = response.item.procedures;
          break;
      }
    })
  }

}
