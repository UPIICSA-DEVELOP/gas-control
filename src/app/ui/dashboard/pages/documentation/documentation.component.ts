/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {UploadFileResponse} from '@app/shared/components/upload-file/upload-file.component';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Subscription} from 'rxjs';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {HashService} from '@app/utils/utilities/hash.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Document} from '@app/utils/interfaces/document';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#documentation', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#documentation', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#documentation', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#documentation', stagger('10ms', [
          animate('.2s ease-in', keyframes([
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)',  offset: 0.5}),
            style({opacity: 0, background: 'transparent',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''},
  encapsulation: ViewEncapsulation.None
})

export class DocumentationComponent implements OnInit, OnDestroy {
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
    this.docsAsea=[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
    this.docsCre=[undefined,undefined];
  }

  ngOnInit() {
    this.stationId = this._activateRoute.params["_value"].station;
    this.listAseaDocs(this._activateRoute.snapshot.data.data.asea);
    this.listCreDocs(this._activateRoute.snapshot.data.data.cre);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  private listAseaDocs(response: any):void{
    switch (response.code){
      case 200:
        if (response.items){
          for(let i=0; i<response.items.length;i++){
            const newType = (response.items[i].type!==19)? response.items[i].type-1 : response.items[i].type-3;
            this.docsAsea[newType]=response.items[i];
          }
        } else {
          this.docsAsea = [];
        }
        break;
      default:
        this._snackBarService.openSnackBar('No se ha podido acceder, intente más tarde','OK',3000);
        this._router.navigate(['/home']).then();
        break;
    }
  }

  private listCreDocs(response: any):void{
    switch (response.code){
      case 200:
        if (response.items){
          for(let i=0; i<response.items.length;i++){
            this.docsCre[response.items[i].type-17]=response.items[i];
          }
        } else {
          this.docsCre = [];
        }
        break;
      default:
        this._snackBarService.openSnackBar('No se ha podido acceder, intente más tarde','OK',3000);
        this._router.navigate(['/home']).then();
        break;
    }
  }

  public uploadFile(event: UploadFileResponse, index: number, regulationType: number, type: number){
    this._documentData = new FormData();
    this._documentData.append('path',this.stationId);
    this._documentData.append('fileName',(regulationType===1?'ASEA-':'CRE-')+ new Date().getTime()+'.pdf');
    this._documentData.append('file', event.file);
    let id = undefined;
    if(regulationType === 1 && this.docsAsea[index]){
      id = this.docsAsea[index].id;
    }else if(regulationType === 2 && this.docsCre[index]){
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

  private chargeFile(file: any){
    let newFile: Document = {
      id: file.id?file.id:undefined,
      regulationType: file.regulationType,
      idStation: this.stationId,
      file: undefined,
      type: file.type
    };
    this._uploadFile.upload(file.formData).subscribe(response=>{
      if(response){
        newFile.file = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        switch(file.regulationType){
          case 1:
            if(this.docsAsea[file.index]){
              this.updateStationDocument(newFile, file.index);
            }else{
              this.createStationDocument(newFile, file.index);
            }
            break;
          case 2:
            if(this.docsCre[file.index]){
              this.updateStationDocument(newFile, file.index);
            }else{
              this.createStationDocument(newFile, file.index);
            }
             break;
        }
      }
    })
  }

  private createStationDocument(document: Document, index: number):void{
    let doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.createDocument(doc).subscribe(response=>{
      switch (response.code){
        case 200:
          this._snackBarService.openSnackBar('Documento actualizado', 'OK', 3000);
          switch (doc.regulationType){
            case 1:
              this.docsAsea[index] = doc;
              break;
            case 2:
              this.docsCre[index] = doc;
              break;
          }
          break;
        default:
          this._snackBarService.openSnackBar('Error al actualizar el documento', 'OK', 3000);
          break;
      }
    })
  }

  private updateStationDocument(document: Document, index: number):void{
    let doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.updateDocument(doc).subscribe(response=>{
      switch (response.code){
        case 200:
          this._snackBarService.openSnackBar('Documento cargado', 'OK', 3000);
          switch (doc.regulationType){
            case 1:
              this.docsAsea[index] = doc;
              break;
            case 2:
              this.docsCre[index] = doc;
              break;
          }
          break;
        default:
          this._snackBarService.openSnackBar('Error al cargar el documento', 'OK', 3000);
          break;
      }
    })
  }

  public closeDocumentation():void{
    this._router.navigate(['/home/profile/gas-station',this.stationId]).then();
  }

  public openPdf(index: number, isAsea: boolean): void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    const url = isAsea ? this.docsAsea[index].file.thumbnail : this.docsCre[index].file.thumbnail;
    switch (user.role){
      case 1:
      case 2:
      case 4:
      case 7:
        this._pdf.open({urlOrFile:  HashService.set("123456$#@$^@1ERF", url)});
        break;
      case 3:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url), hideDownload: true});
        break;
    }
  }
}
