/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {Router} from '@angular/router';
import {PdfVisorService} from 'app/shared/components/pdf-visor/pdf-visor.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {HashService} from 'app/utils/utilities/hash.service';
import {Procedure} from '@app/utils/interfaces/procedure';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/procedures/animation';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
  animations: [ANIMATION]
})
export class ProceduresComponent implements OnInit {
  @HostBinding('@fadeInAnimation')

  public procedures: Procedure[];

  constructor(
    private _api: ApiService,
    private _route: Router,
    private _pdf: PdfVisorService
  ) {

  }

  ngOnInit() {
    this.getProcedures();
  }

  public onCloseProcedures(): void {
    this._route.navigate(['/home']).then();
  }

  public openFile(url: any): void {
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role) {
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url)});
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: true});
        break;
    }
  }

  private getProcedures(): void {
    this._api.getUtils().subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.procedures = response.item.procedures;
      }
    });
  }

}
