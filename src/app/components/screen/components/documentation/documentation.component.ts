/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

interface Document{
  id?: string;
  idStation: string;
  regulationType: number;
  type: number;
  file: any;
}

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
  host: {'[@fadeInAnimation]': ''}
})

export class DocumentationComponent implements OnInit {
  public isASEA: boolean;
  public stationId: string;
  public docsAsea: any[];
  public docsCre: any[];
  public load: boolean;
  private _documentData: FormData;
  constructor(
    private _uploadFile: UploadFileService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _snackBarService: SnackBarService
  ) {
    this.isASEA = true;
    this.docsAsea=[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
    this.docsCre=[undefined,undefined];
  }

  ngOnInit() {
    if (this._activateRoute.snapshot.queryParams.station) {
      this.stationId = this._activateRoute.snapshot.queryParams.station;
      this.getDocuments();
    }
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }

  private getDocuments():void{
    this._api.listDocumentByStation(this.stationId, '2').subscribe(response=>{
      switch (response.code){
        case 200:
          if (response.items){
            for(let i=0; i<response.items.length;i++){
              this.docsCre[response.items[i].type-17]=response.items[0];
            }
          } else {
            this.docsCre = [];
          }
          break;
        default:
          break;
      }
    });
    this._api.listDocumentByStation(this.stationId, '1').subscribe(response=>{
      switch (response.code){
        case 200:
          if (response.items){
            for(let i=0; i<response.items.length;i++){
              this.docsAsea[response.items[i].type!==19?response.items[i].type-1:response.items[i].type-3]=response.items[0];
            }
          } else {
            this.docsAsea = [];
          }
          break;
        default:
          break;
      }
    });
  }

  public uploadFile(event: UploadFileResponse, index: number, regulationType: number, type: number){
    this._documentData = new FormData();
    this._documentData.append('path',this.stationId);
    this._documentData.append('fileName',regulationType===1?'ASEA-':'CRE-'+new Date().getTime()+'.pdf');
    this._documentData.append('file', event.file);
    this.chargeFile({
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
    this._api.updateDocumet(doc).subscribe(response=>{
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
    this._router.navigate(['/home/profile/gas-station'], {queryParams:{id: this.stationId}}).then();
  }
}
