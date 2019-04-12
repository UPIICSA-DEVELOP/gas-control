/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Subscription} from 'rxjs/Rx';
import {HashService} from '@app/core/utilities/hash.service';
import {SgmSelection} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {environment} from '@env/environment';

@Component({
  selector: 'app-sgm',
  templateUrl: './sgm.component.html',
  styleUrls: ['./sgm.component.scss']
})
export class SgmComponent implements OnInit, OnDestroy {
  public station: any;
  public sgmDocument: any[];
  public templates: any[];
  public load: boolean;
  public software: number;
  public magna: boolean;
  public premium: boolean;
  public diesel: boolean;
  public elementOnView: number;
  public listTasks: any[];
  public zones: string[];
  public priority: string[];
  public frequency: string[];
  public generate: boolean;
  public isAvailable: boolean;
  public dateGeneration: string[];
  public isDevelop: boolean;
  private _subscriptionLoader: Subscription;
  private _token: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _matDialogRef: MatDialogRef<SgmComponent>,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _pdf: PdfVisorService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) {
    this.isDevelop = environment.develop;
    this.zones = Constants.Zones;
    this.frequency = Constants.Frequency;
    this.priority = Constants.Level;
    this.dateGeneration = [];
    this.isAvailable = false;
    this.generate = false;
    this.sgmDocument = [];
    this.templates = [];
    this.software = 0;
    this.magna = false;
    this.premium = false;
    this.diesel = false;
    this.elementOnView = 0;
    this.listTasks = [];
    this._token = undefined;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load});
    this.getStation();
    this.getSgm();
    this.sortSgmArray();
  }

  ngOnDestroy() {
    this._subscriptionLoader.unsubscribe();
  }

  public close():void{
    this._matDialogRef.close();
  }

  public seeFile(url: any):void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url)});
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url), hideDownload: true});
        break;
    }
  }

  public saveSgmSelection():void{
    const selection: SgmSelection = {
      diesel: this.diesel,
      id: this.station.id,
      magna: this.magna,
      premium: this.premium,
      software: this.software.toString()
    };
    this._api.saveSgmSelection(selection).subscribe(response => {
      switch (response.code){
        case 200:
          this.getSgm();
          this._snackBarService.openSnackBar('Información actualizada', 'OK', 3000);
          break;
          default:
            this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
          break;
      }
    })
  }

  public getStationTasks(isAnnexedOne: boolean):void{
    let type = '0';
    this._token = null;
    if(isAnnexedOne){
      this.elementOnView = 1;
      type = '41';
    }else{
      this.elementOnView = 2;
      type = '31';
    }
    this._api.listTask({
      stationTaskId: this.station.stationTaskId,
      startDate: '',
      status: '4',
      endDate: '',
      firstOpen: true,
      type: type,
      cursor: this._token
    }).subscribe(response => {
      switch (response.code){
        case 200:
          if(this._token === response.nextPageToken){
            this._token = null;
          }else{
            this._token = response.nextPageToken;
          }
          this.listTasks = this.buildListTasks(response.items);
          break;
        default:
          this.listTasks = [];
          break;
      }
    });
  }

  public generateSgm():void{
    let error = false;
    if(!this.magna && !this.premium && !this.diesel){
      error = true
    }
    if(!this.software){
      error = true;
    }
    if(error){
      this._snackBarService.openSnackBar('Por favor, complete la información para generar el SGM','OK',3000);
      return;
    }else{
      this._api.getFullPDF(this.station.id, true).subscribe(response =>{
        switch(response.code){
          case 200:
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date);
            if(response.item.date <= today.timeStamp){
              this.isAvailable = true;
            }
            break;
          default:
            this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
            break;
        }
      });
    }
  }

  public seeSGM(): void{
    this._api.joinPDF(this.station.id, true).subscribe(response => {
      const user = LocalStorageService.getItem(Constants.UserInSession);
      switch (user.role){
        case 1:
        case 2:
        case 7:
          this._pdf.open({urlOrFile: response});
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          this._pdf.open({urlOrFile: response, hideDownload: true });
          break;
      }
    });
  }

  public changeOptions(newView: number): void{
    this.getSgm();
    this.elementOnView = newView;
  }

  private getSgm(): void{
    this._api.getSgm(this._data.stationId).subscribe(response => {
      switch(response.code){
        case 200:
          if(response.item.sgmSelection){
            this.software = Number(response.item.sgmSelection.software);
            this.magna = response.item.sgmSelection.magna;
            this.premium = response.item.sgmSelection.premium;
            this.diesel = response.item.sgmSelection.diesel;
          }
          if(response.item.fullSgm){
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.fullSgm.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date());
          if(response.item.fullSgm.date <= today.timeStamp){
              this.isAvailable = true;
            }
          }
          break;
        default:
          break;
      }
    })
  }

  private getStation(): void{
    this._api.getStation(this._data.stationId).subscribe(response => {
      switch (response.code){
        case 200:
          this.station = response.item;
          break;
        default:
          this.station = null;
          break;
      }
    });
  }

  private sortSgmArray():void{
    this._data.utils.sgmDocuments.forEach(item => {
      if(Number(item.id) <= 10){
        this.sgmDocument.push(item);
      }else{
        this.templates.push(item);
      }
    });
  }

  private buildListTasks(listTask: any): any[]{
    let newList = [];
    if(!listTask){
      return newList;
    }
    listTask.forEach(item =>{
      this._data.utils.taskTemplates.forEach(origin => {
        if(item.type == origin.id){
          newList.push({date: UtilitiesService.convertDate(item.date), origin: origin});
        }
      });
    });
    return newList;
  }

}
