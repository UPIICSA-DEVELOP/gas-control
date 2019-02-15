/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DatepickerService, DateRangeOptions} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, DoCheck {
  public station: any;
  @Input() set stationInfo(stationObj:any){
    if(stationObj){
      this.station = stationObj;
      this.getStationTask();
    }
  }
  @Input() public taskTemplate: any;
  @ViewChild('searchBox') private _searchBox: ElementRef;
  public startDate: Date;
  public endDate: Date;
  public filters: any;
  public start: any;
  public end: any;
  public today: boolean;
  public showSearchBox: boolean;
  public tasks: any[];
  public tasksFilterd: any[];
  public copyTasks: any[];
  public zones: any[];
  public priority: any[];
  public typeFilter: string[];
  public filter: number;
  public creationDate: number;
  public load: boolean;
  public user: any;
  public notCalendar: boolean;
  constructor(
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _addStationService: AddStationService
  ) {
    this.today = false;
    this.notCalendar = false;
    this.filter = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.tasksFilterd = [];
    this.copyTasks = [];
    this.priority = Constants.Level;
    this.zones = Constants.Zones;
    this.typeFilter = Constants.Filters;
  }

  ngOnInit() {
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this._apiLoader.getProgress().subscribe(load=>{this.load=load});
    if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
      this.today = true;
    }
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
  }


  ngDoCheck():void{
      this.notCalendar = LocalStorageService.getItem(Constants.NotCalendarTask);
  }

  private getStationTask():void{
    this.filters = {
      stationTaskId: this.station.stationTaskId || '0',
      startDate: (this.start.timeStamp).toString(),
      status: (this.filter).toString(),
      endDate: (this.end.timeStamp).toString()
    };
    this._api.listTaskDateStatus(this.filters).subscribe(response=>{
      switch (response.code){
        case 200:
          this.tasks = response.items;
          if(response.items){
            this.tasksCompare();
          }
          break;
        default:
          this.tasks=[];
          break;
      }
    });
  }

  private tasksCompare():void{
    this.tasksFilterd = [];
    this.tasks.forEach(task => {
      this.taskTemplate.taskTemplates.forEach(template => {
        if(task.type === Number(template.id)){
          this.tasksFilterd.push({
            type: task.type,
            date: UtilitiesService.convertDate(task.date),
            name: template.name,
            zone: template.zone,
            level: template.level,
            hwg: template.hwg,
            typeReport: this.filter===5?9:template.typeReport
          });
        }
      });
    });
    this.copyTasks = this.tasksFilterd;
  }

  public dateFilter():void{
    this._api.getStationTask(this.station.stationTaskId).subscribe(response=>{
      switch (response.code){
        case 200:
          this.creationDate = response.item.creationDate;
          const config: DateRangeOptions = {
            minDate: new Date((this.creationDate).toString().slice(0,4)+'-'+(this.creationDate).toString().slice(4,6)+'-'+(this.creationDate).toString().slice(6,8)),
            maxDate: new Date(((Number((this.creationDate).toString().slice(0,4)))+1).toString()+'-'+(this.creationDate).toString().slice(4,6)+'-'+(this.creationDate).toString().slice(6,8))
          };
          this._dateService.open(config).afterClosed().subscribe(response=>{
            switch (response.code) {
              case 1:
                this.today = response.startDate == response.endDate;
                this.startDate = response.startDate;
                this.endDate = response.endDate;
                this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
                this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
                this.getStationTask();
                break;
            }
          });
          break;
      }
    });
  }

  public taskFilter():void{
    this._filterService.open(this.filter).afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.filter = response.filter;
          this.getStationTask();
          break;
      }
    })
  }

  public resetFilters():void{
    this.filter=0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
    this.today = true;
    this.getStationTask()
  }

  public search(): void{
    if(!this.showSearchBox){
      this.showSearchBox = !this.showSearchBox;
      this._searchBox.nativeElement.style.width = '100%';
    }else{
      this._searchBox.nativeElement.style.width = '0';
      setTimeout(() => {
        this.showSearchBox = !this.showSearchBox;
      }, 250);
    }
  }

  public searchTask(event:any):void{
    const newArray = [];
    if(!this.showSearchBox){
      event.srcElement.value = '';
    }
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.tasksFilterd = this.copyTasks;
    }else{
      for(let x=0; x < this.copyTasks.length; x++){
        if(UtilitiesService.removeDiacritics(this.copyTasks[x].name).toLowerCase().includes(text)){
          newArray.push(this.copyTasks[x]);
        }
      }
      if(newArray.length > 0){
        this.tasksFilterd = newArray;
      }else{
        this.tasksFilterd = this.copyTasks;
      }
    }
  }

  public createStationTasks():void{
    this._addStationService.open({
      stepActive: 3,
      stationId: this.station.id,
      disableClose: true
    });
  }
}
