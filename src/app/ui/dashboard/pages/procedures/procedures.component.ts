/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PdfVisorService} from 'app/shared/components/pdf-visor/pdf-visor.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {HashService} from 'app/utils/utilities/hash.service';
import {Procedure} from '@app/utils/interfaces/procedure';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/procedures/animation';
import {DialogResponse, DialogService, LocalStorageService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {UserMedia} from '@app/utils/interfaces/user-media';
import {CustomProcedure} from '@app/utils/interfaces/customProcedure';
import {FileCS} from '@app/utils/interfaces/file-cs';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
  animations: [ANIMATION]
})
export class ProceduresComponent implements OnInit {
  @HostBinding('@fadeInAnimation')
  public stationId: string;
  public procedures: Procedure[];
  public stationProcedures: CustomProcedure[];
  public role: number;
  private _formData: FormData;
  private _newProcedure: FileCS;

  constructor(
    private _api: ApiService,
    private _route: Router,
    private _pdf: PdfVisorService,
    private _uploadFile: UploadFileService,
    private _activatedRoute: ActivatedRoute,
    private _dialog: DialogService
  ) {
    this.role = 0;
    this.stationProcedures = [];
    this.procedures = [];
    this._formData = null;
  }

  ngOnInit() {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    this.role = user.role;
    if (this._activatedRoute.snapshot.queryParams.station) {
      this.stationId = this._activatedRoute.snapshot.queryParams.station;
    }
    this.getProcedures();
    this.getStationProcedures();
  }

  public onCloseProcedures(): void {
    this._route.navigate(['/home']).then();
  }

  public addNewProcedure(event: UserMedia): void {
    this._formData = new FormData();
    this._formData.append('path', '');
    this._formData.append('fileName', 'procedure-' + this.stationId + '-' + new Date().getTime() + '.pdf');
    this._formData.append('file', event.blob);
    this.assignName();
  }

  public openFile(url: any): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
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

  private uploadProcedure(name: string): void {
    this._uploadFile.upload(this._formData).subscribe(response => {
      if (response.code === 200) {
        this._newProcedure = {
          thumbnail: response.item.thumbnail || '',
          blobName: response.item.blobName || ''
        };
        this.saveCustomProcedure(name);
      }
    });
  }

  private assignName(): void {
    this._dialog.withInput('Información', 'Asigne un nombre al procedimiento', {
      placeholder: 'Nombre',
      accept: 'ACEPTAR',
      cancel: 'CANCELAR'
    }).afterClosed().subscribe((response: DialogResponse) => {
      if (response && response.code === 'ACCEPT') {
         this.uploadProcedure(response.data.value);
      }
    });
  }

  private getStationProcedures(): void {
    this._api.customProcedureList(this.stationId).subscribe((response) => {
      if (response.items) {
        this.stationProcedures = this.stationProcedures.concat(response.items || []);
      }
    });
  }

  private saveCustomProcedure(name: string): void {
    const procedure: CustomProcedure = {
      customProcedureId: 1001 + this.stationProcedures.length,
      fileCS: this._newProcedure,
      name: name,
      stationId: this.stationId
    };
    this._api.createCustomProcedure(procedure).subscribe((response) => {
      switch (response.code) {
        case HttpResponseCodes.OK:
          this.stationProcedures.push(response.item);
          break;
      }
    });
  }

}
