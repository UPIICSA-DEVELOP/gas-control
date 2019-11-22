/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {UploadFileResponse} from '@app/shared/components/upload-file/upload-file.component';
import {Subscription} from 'rxjs';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {HashService} from '@app/utils/utilities/hash.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Document} from '@app/utils/interfaces/document';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/documentation/animation';
import {LocalStorageService, SnackBarService} from 'ng-maplander';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  animations: [ANIMATION]
})

export class DocumentationComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  public isASEA: boolean;
  public stationId: string;
  public docsAsea: any[];
  public docsCre: any[];
  public load: boolean;
  private _documentData: FormData;
  private _subscriptionLoader: Subscription;

  constructor(
    private _uploadFile: UploadFileService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _snackBarService: SnackBarService,
    private _pdf: PdfVisorService
  ) {
    this.isASEA = true;
    this.docsAsea = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.docsCre = [null, null];
  }

  ngOnInit() {
    this.stationId = this._activateRoute.params['_value'].station;
    this.listAseaDocs(this._activateRoute.snapshot.data.data.asea);
    this.listCreDocs(this._activateRoute.snapshot.data.data.cre);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  private listAseaDocs(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      if (response.items) {
        for (let i = 0; i < response.items.length; i++) {
          const newType = (response.items[i].type !== 19) ? response.items[i].type - 1 : response.items[i].type - 3;
          this.docsAsea[newType] = response.items[i];
        }
      } else {
        this.docsAsea = [];
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }

  private listCreDocs(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      if (response.items) {
        for (let i = 0; i < response.items.length; i++) {
          this.docsCre[response.items[i].type - 17] = response.items[i];
        }
      } else {
        this.docsCre = [];
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }

  public uploadFile(event: UploadFileResponse, index: number, regulationType: number, type: number) {
    this._documentData = new FormData();
    this._documentData.append('path', this.stationId);
    this._documentData.append('fileName', (regulationType === 1 ? 'ASEA-' : 'CRE-') + new Date().getTime() + '.pdf');
    this._documentData.append('file', event.file);
    let id = null;
    if (regulationType === 1 && this.docsAsea[index]) {
      id = this.docsAsea[index].id;
    } else if (regulationType === 2 && this.docsCre[index]) {
      id = this.docsCre[index].id;
    }
    this.chargeFile({
      id: id,
      regulationType: regulationType,
      formData: this._documentData,
      type: type,
      index: index
    });
  }

  private chargeFile(file: any) {
    const newFile: Document = {
      id: file.id ? file.id : null,
      regulationType: file.regulationType,
      idStation: this.stationId,
      file: null,
      type: file.type
    };
    this._uploadFile.upload(file.formData).subscribe(response => {
      if (response) {
        newFile.file = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        switch (file.regulationType) {
          case 1:
            if (this.docsAsea[file.index]) {
              this.updateStationDocument(newFile, file.index);
            } else {
              this.createStationDocument(newFile, file.index);
            }
            break;
          case 2:
            if (this.docsCre[file.index]) {
              this.updateStationDocument(newFile, file.index);
            } else {
              this.createStationDocument(newFile, file.index);
            }
            break;
        }
      }
    });
  }

  private createStationDocument(document: Document, index: number): void {
    const doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.createDocument(doc).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.setMessage('Documento actualizado', 'OK', 3000);
        switch (doc.regulationType) {
          case 1:
            this.docsAsea[index] = doc;
            break;
          case 2:
            this.docsCre[index] = doc;
            break;
        }
      } else {
        this._snackBarService.setMessage('Error al actualizar el documento', 'OK', 3000);
      }
    });
  }

  private updateStationDocument(document: Document, index: number): void {
    const doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.updateDocument(doc).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.setMessage('Documento cargado', 'OK', 3000);
        switch (doc.regulationType) {
          case 1:
            this.docsAsea[index] = doc;
            break;
          case 2:
            this.docsCre[index] = doc;
            break;
        }
      } else {
        this._snackBarService.setMessage('Error al cargar el documento', 'OK', 3000);
      }
    });
  }

  public closeDocumentation(): void {
    this._router.navigate(['/home/profile/gas-station', this.stationId]).then();
  }

  public openPdf(index: number, isAsea: boolean): void {
    const user = LocalStorageService.getItem(Constants.UserInSession);
    const url = isAsea ? this.docsAsea[index].file.thumbnail : this.docsCre[index].file.thumbnail;
    switch (user.role) {
      case 1:
      case 2:
      case 4:
      case 7:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url)});
        break;
      case 3:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: true});
        break;
    }
  }
}
