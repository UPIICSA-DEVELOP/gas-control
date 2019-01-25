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

interface Document{
  id?: string;
  idStation: string;
  regulationType: number;
  type: number;
  file:any;
}

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#profile', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#profile', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#profile', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#profile', stagger('10ms', [
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
  public newDocumentsAsea: FormData[];
  public newDocumentsCre: FormData[];
  constructor(
    private _uploadFile: UploadFileService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _api: ApiService
  ) { }

  ngOnInit() {
    this.docAseaExist = [];
    this.docCreExist = [];
    this.isASEA = true;
    if (this._activateRoute.snapshot.queryParams.station) {
      this.stationId = this._activateRoute.snapshot.queryParams.station;
      this.getDocuments();
    }
  }

  private getDocuments():void{
    this._api.listDocumentByStation(this.stationId, '2').subscribe(response=>{
      switch (response.code){
        case 200:
          this.docsCre = response.items;
          if (this.docsCre){
            for (let doc = 0; doc<this.docsCre.length; doc++){
              for (let type = 1; type<19; type++){
                if(this.docsCre[doc].type === type){
                  this.docAseaExist.push(true);
                }
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
          this.docsAsea = response.items;
          if (this.docsAsea){
            for (let doc = 0; doc<this.docsAsea.length; doc++){
              for (let type = 1; type<19; type++){
                if(this.docsAsea[doc].type === type){
                  this.docAseaExist.push(true);
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

  public onLoadFile(event: UploadFileResponse, index: number, documentExist: boolean, regulation: number){
    let doc = new FormData();
    doc.append('path',this.stationId);
    doc.append('fileName','Doc1-'+new Date().getTime()+'.pdf');
    doc.append('file', event.file);
    switch (regulation){
      case 1:
        this.docAseaExist[index] = true;
        this.newDocumentsAsea.push(doc);
        break;
      case 2:
        this.docCreExist[index] = true;
        this.newDocumentsCre.push(doc);
        break;
    }
  }
}
