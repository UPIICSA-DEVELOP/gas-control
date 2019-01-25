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
import {UtilitiesService} from '@app/core/utilities/utilities.service';

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
  public docAseaExist: boolean[];
  public docCreExist: boolean[];
  public newDocumentsAsea: any[];
  public newDocumentsCre: any[];
  public newAsea: any[];
  public newCre: any[];
  public updateDocCre: any[];
  public updateDocAsea: any[];
  public updateNewDocCre: any[];
  public updateNewDocAsea: any[];
  public load: boolean;
  constructor(
    private _uploadFile: UploadFileService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService
  ) {
    this.isASEA = true;
  }

  ngOnInit() {
    this.docAseaExist = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    this.docCreExist = [false,false];
    this.newDocumentsCre = [];
    this.newDocumentsAsea = [];
    this.newCre = [];
    this.newAsea = [];
    this.updateDocCre = [];
    this.updateDocAsea = [];
    this.updateNewDocCre = [];
    this.updateNewDocAsea = [];
    if (this._activateRoute.snapshot.queryParams.station) {
      this.stationId = this._activateRoute.snapshot.queryParams.station;
      this.getDocuments();
    }
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }

  private getDocuments():void{
    debugger;
    this._api.listDocumentByStation(this.stationId, '2').subscribe(response=>{
      switch (response.code){
        case 200:
          this.docsCre = UtilitiesService.sortJSON(response.items, 'type','asc');
          if (this.docsCre){
            for (let doc = 0; doc<this.docsCre.length; doc++){
              for (let type = 17; type<19; type++){
                this.docCreExist[doc] = this.docsCre[doc].type === type;
              }
            }
          }
          break;
        default:
          break;
      }
    });
    this._api.listDocumentByStation(this.stationId, '1').subscribe(response=>{
      switch (response.code){
        case 200:
          this.docsAsea = UtilitiesService.sortJSON(response.items,'type','asc');
          if (this.docsAsea){
            for (let doc = 0; doc<this.docsAsea.length; doc++){
              for (let type = 1; type<19; type++){
                if(this.docsAsea[doc].type === type){
                  this.docAseaExist[doc]=this.docsAsea[doc].type === type;
                }
              }
            }
          }
          break;
        default:
          break;
      }
    });
  }

  public onLoadFile(event: UploadFileResponse, index: number, documentExist: boolean, regulation: number, docType?:number){
    let doc = new FormData();
    doc.append('path',this.stationId);
    doc.append('fileName','Doc1-'+new Date().getTime()+'.pdf');
    doc.append('file', event.file);
    switch (regulation){
      case 1:
        if (documentExist){
          this.docAseaExist[index] = true;
          this.updateDocAsea.push({document: doc, regulation: docType})
        }else{
          this.docAseaExist[index] = true;
          this.newDocumentsAsea.push({document: doc, regulation: docType});
        }
        break;
      case 2:
        if (documentExist){
          this.docCreExist[index] = true;
          this.updateDocCre.push({document: doc, regulation: docType});
        }else{
          this.docCreExist[index] = true;
          this.newDocumentsCre.push({document: doc, regulation: docType});
        }
        break;
    }
  }

  private uploadExistFilesCre():void{
    if(this.updateDocCre.length>0){
      for (let i=0; i<this.updateDocCre.length;i++){
        this._uploadFile.upload(this.updateDocCre[i].document).subscribe(response=>{
          if (response){
            this.updateNewDocCre.push({blobName: response.item.blobName, thumbnail: response.item.thumbnail, type: this.updateDocCre[i].regulation});
            if (i===this.updateDocCre.length-1){
              this.updateDocCre=null;
              this.saveDocs();
            }
          }
        });
      }
    }else{
      this.updateDocCre=null;
      this.saveDocs();
    }
  }

  private uploadExistFilesAsea():void{
    if(this.updateDocAsea.length>0){
      for (let i=0; i<this.updateDocAsea.length;i++){
        this._uploadFile.upload(this.updateDocAsea[i].document).subscribe(response=>{
          if (response){
            this.updateNewDocAsea.push({blobName: response.item.blobName, thumbnail: response.item.thumbnail, type: this.updateDocAsea[i].regulation});
            if (i===this.updateDocAsea.length-1){
              this.updateDocAsea=null;
              this.saveDocs();
            }
          }
        });
      }
    }else{
      this.updateDocAsea=null;
      this.saveDocs();
    }
  }

  private uploadNewFilesCre():void{
    if(this.newDocumentsCre.length>0){
      for (let i=0; i<this.newDocumentsCre.length;i++){
        this._uploadFile.upload(this.newDocumentsCre[i].document).subscribe(response=>{
          if (response){
            this.newCre.push({blobName: response.item.blobName, thumbnail: response.item.thumbnail, type: this.newDocumentsCre[i].regulation});
            if (i===this.newDocumentsCre.length-1){
              this.newDocumentsCre=null;
              this.saveDocs();
            }
          }
        });
      }
    }else{
      this.newDocumentsCre=null;
      this.saveDocs();
    }
  }

  private uploadNewFilesAsea():void{
    if (this.newDocumentsAsea.length>0){
      for (let i=0; i<this.newDocumentsAsea.length;i++){
        this._uploadFile.upload(this.newDocumentsAsea[i].document).subscribe(response=>{
          if (response){
            this.newAsea.push({blobName: response.item.blobName, thumbnail: response.item.thumbnail, type: this.newDocumentsAsea[i].regulation});
            if(i===this.newDocumentsAsea.length-1){
              this.newDocumentsAsea=null;
              this.saveDocs();
            }
          }
        });
      }
    }else{
      this.newDocumentsAsea=null;
      this.saveDocs();
    }
  }

  public saveDocs(): void{
    if (this.newDocumentsAsea){
      this.uploadNewFilesAsea();
      return;
    }
    if (this.newDocumentsCre){
      this.uploadNewFilesCre();
      return;
    }
    if (this.updateDocCre){
      this.uploadExistFilesCre();
      return;
    }
    if (this.updateDocAsea){
      this.uploadExistFilesAsea();
    }
    this.chargeNewAseaDocuments();
  }

  private chargeNewAseaDocuments():void{
    if(this.newAsea){
      if(this.newAsea.length>0){
        for (let i = 0; i < this.newAsea.length; i++){
          let doc: Document = {
            idStation: this.stationId,
            file:{
              blobName: this.newAsea[i].blobName,
              thumbnail: this.newAsea[i].thumbnail
            },
            type: this.newAsea[i].type,
            regulationType: 1
          };
          this._api.createDocument(doc).subscribe(response=>{
            switch (response.code){
              case 200:
                if (i===this.newAsea.length-1){
                  this.chargeNewCreDocuments();
                }
                break;
              default:
                break;
            }
          });
        }
      }else{
        this.chargeNewCreDocuments();
      }
    }else{
      this.chargeNewCreDocuments();
    }
  }

  private chargeNewCreDocuments():void{
    if(this.newCre){
      if (this.newCre.length>0){
        for (let i = 0; i < this.newCre.length; i++){
          let doc: Document = {
            idStation: this.stationId,
            file:{
              blobName: this.newCre[i].blobName,
              thumbnail: this.newCre[i].thumbnail
            },
            type: this.newCre[i].type,
            regulationType: 2
          };
          this._api.createDocument(doc).subscribe(response=>{
            switch (response.code){
              case 200:
                if (i===this.newCre.length-1){
                  this.chargeExistAseaDocuments();
                }
                break;
              default:
                break;
            }
          });
        }
      }else{
        this.chargeExistAseaDocuments();
      }
    }else{
      this.chargeExistAseaDocuments();
    }
  }

  private chargeExistAseaDocuments():void{
    if (this.updateNewDocAsea){
      if (this.updateNewDocAsea.length>0){
        for(let i=0; i<this.updateNewDocAsea.length;i++){
          for (let j=0; j<this.docsAsea.length;j++){
            if(this.docsAsea[j].type===this.updateNewDocAsea[i].type){
              let document: Document = {
                id: this.docsAsea[j].id,
                idStation: this.stationId,
                regulationType: 1,
                file: {
                  blobName: this.updateNewDocAsea[i].blobName,
                  thumbnail: this.updateNewDocAsea[i].thumbnail
                },
                type: this.docsAsea[j].type
              };
              this._api.updateDocumet(document).subscribe(response=>{
                switch (response.code){
                  case 200:
                    if (i===this.updateNewDocAsea.length-1){
                      this.chargeExistCreDocuments();
                    }
                    break;
                  default:
                    break;
                }
              })
            }
          }
        }
      }else{
        this.chargeExistCreDocuments();
      }
    }else{
      this.chargeExistCreDocuments();
    }
  }

  private chargeExistCreDocuments():void{
    if (this.updateNewDocCre){
      if (this.updateNewDocCre.length>0){
        for(let i=0; i<this.updateNewDocCre.length;i++){
          for (let j=0; j<this.docsCre.length;j++){
            if(this.docsCre[j].type===this.updateNewDocCre[i].type){
              let document: Document = {
                id: this.docsCre[j].id,
                idStation: this.stationId,
                regulationType: 2,
                file: {
                  blobName: this.updateNewDocCre[i].blobName,
                  thumbnail: this.updateNewDocCre[i].thumbnail
                },
                type: this.docsCre[j].type
              };
              this._api.updateDocumet(document).subscribe(response=>{
                switch (response.code){
                  case 200:
                    if (i===this.updateNewDocCre.length-1){
                      this._router.navigate(['/home/profile/gas-station'], {queryParams:{id: this.stationId}});
                    }
                    break;
                  default:
                    break;
                }
              })
            }
          }
        }
      }else{
        this._router.navigate(['/home/profile/gas-station'], {queryParams:{id: this.stationId}});
      }
    }else{
      this._router.navigate(['/home/profile/gas-station'], {queryParams:{id: this.stationId}});
    }
  }
}
