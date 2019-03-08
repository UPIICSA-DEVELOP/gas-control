/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {DatepickerService, DateRangeOptions} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {TaskFilterNameService} from '@app/components/screen/components/task-filter-name/task-filter-name.service';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, DoCheck {
  public station: any;
  @Input() set stationInfo(stationObj: any) {
    if (stationObj) {
      this.others = false;
      this.tasks = [];
      this.notCalendarTasks = [];
      this.station = stationObj;
      this.getStationTask();
    }else{
      this.others = false;
      this.tasks = [];
      this.notCalendarTasks = [];
    }
  }

  @Input() public taskTemplate: any;
  public startDate: Date;
  public endDate: Date;
  public filters: any;
  public start: any;
  public end: any;
  public today: boolean;
  public tasks: any[];
  private _lastTabSelected: number;
  public tasksFilterd: any[];
  public zones: any[];
  public priority: any[];
  public typeFilter: string[];
  public filter: number;
  private _creationDate: number;
  public itemsTasks: any[];
  public load: boolean;
  public user: any;
  public notCalendar: boolean;
  public taskWithDivider: any[];
  public date: any[];
  public others: boolean;
  public notCalendarTasks: any[];
  private _firstOpen: boolean;
  private _taskType: string;
  private _taskListPaged: any;
  public typeReportView: number;
  public reportView: boolean;
  public taskElement: any;
  constructor(
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _addStationService: AddStationService,
    private _taskFilterNameService: TaskFilterNameService,
    private _sharedService: SharedService
  ) {
    this.typeReportView = 0;
    this.reportView = false;
    this.itemsTasks = [];
    this.others = false;
    this.date = [];
    this.taskWithDivider = [];
    this.today = false;
    this.notCalendar = false;
    this.filter = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.tasksFilterd = [];
    this.priority = Constants.Level;
    this.zones = Constants.Zones;
    this.typeFilter = Constants.Filters;
    this._firstOpen = true;
    this._taskType = '0';
    this.tasks = [];
    this.notCalendarTasks = [];
    this._taskListPaged = {
      lastIndex: null,
      list: null
    };
    this._lastTabSelected = 0;
  }

  ngOnInit() {
    this.checkChanges();
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
      this.today = true;
    }
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
  }

  ngDoCheck(): void {
    this.notCalendar = LocalStorageService.getItem(Constants.NotCalendarTask);
  }

  private checkChanges():void{
    this._sharedService.getNotifications().subscribe((response: SharedNotification)=>{
      switch (response.type){
        case SharedTypeNotification.NotCalendarTask:
          this.resetFilters();
          this.others = true;
          this.getNotCalendarTask();
          break;
      }
    })
  }

  private getStationTask(): void {
    this.filters = {
      stationTaskId: this.station.stationTaskId || '0000',
      startDate: (this.start.timeStamp).toString(),
      status: (this.filter).toString(),
      endDate: (this.end.timeStamp).toString(),
      firstOpen: this._firstOpen,
      type: this._taskType || ''
    };
    this.taskWithDivider = [];
    this.tasksFilterd = [];
    this._api.listTask(this.filters).subscribe(response => {
      switch (response.code) {
        case 200:
          if (response.items) {
            this.tasks = response.items;
            this.tasksCompare();
          }
          break;
        default:
          break;
      }
    });
  }

  private tasksCompare(): void {
    this.load = true;
    this.tasks.forEach(task => {
      this.taskTemplate.taskTemplates.forEach(template => {
        if (task.type === Number(template.id)) {
          this.tasksFilterd.push({
            id: task.id,
            type: task.type,
            date: UtilitiesService.convertDate(task.date),
            originalDate: task.date,
            name: template.name,
            zone: template.zone,
            level: template.level,
            hwg: template.hwg,
            typeReport: template.typeReport,
            status: task.status,
            evidence: template.evidence
          });
        }
      });
    });
    this.sortTaskArrayByStatus();
  }

  public sortTaskArrayByStatus(): void {
    let historyArray = [];
    for(let i = 0; i<this.tasksFilterd.length; i++){
      if(this.tasksFilterd[i].status === 3 || this.tasksFilterd[i].status === 4){
        historyArray.push(this.tasksFilterd[i]);
      }
    }
    historyArray = UtilitiesService.sortJSON(historyArray, 'originalDate', 'desc');
    let headerPrevious = false, headerToday = false;
    this.tasksFilterd = UtilitiesService.sortJSON(this.tasksFilterd, 'status', 'asc');
    this.tasksFilterd.forEach(item => {
      if (item.status === 1) {
        if(!headerToday && this.filter === 0){
          this.taskWithDivider.push({
            type: 1,
            title: 'Hoy',
            original: null,
            id: ''
          });
        }
        headerToday = true;
        this.taskWithDivider.push({
          type: 2,
          title: '',
          original: item,
          id: item.id
        });
      } else if (item.status === 2) {
        if (!headerPrevious && this.filter === 0){
          this.taskWithDivider.push({
            type: 1,
            title: 'Atrasadas',
            original: null,
            id: ''
          });
          headerPrevious = true;
          this.taskWithDivider.push({
            type: 2,
            title: '',
            original: item,
            id: item.id
          });
        } else {
          this.taskWithDivider.push({
            type: 2,
            title: '',
            original: item,
            id: item.id
          });
        }
      }
    });
    if(historyArray.length!==0){
      if(this.filter === 0){
        this.taskWithDivider.push({
          type: 1,
          title: 'Historial',
          original: null,
          id: ''
        });
      }
      for(let i = 0; i< historyArray.length; i++){
        this.taskWithDivider.push({
          type: 2,
          title: '',
          original: historyArray[i],
          id: historyArray[i].id
        })
      }
    }
    this.load = false;
  }

  public dateFilter(): void {
    this._api.getStationTask(this.station.stationTaskId).subscribe(response => {
      switch (response.code) {
        case 200:
          this._creationDate = response.item.creationDate;
          const config: DateRangeOptions = {
            minDate: new Date((this._creationDate).toString().slice(0, 4) + '-' + (this._creationDate).toString().slice(4, 6) + '-' + (this._creationDate).toString().slice(6, 8)),
            maxDate: new Date(((Number((this._creationDate).toString().slice(0, 4))) + 1).toString() + '-' + (this._creationDate).toString().slice(4, 6) + '-' + (this._creationDate).toString().slice(6, 8))
          };
          this._dateService.open(config).afterClosed().subscribe(response => {
            switch (response.code) {
              case 1:
                this.today = response.startDate == response.endDate;
                this.startDate = response.startDate;
                this.endDate = response.endDate;
                if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
                  this.today = true;
                }
                this._firstOpen = false;
                this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
                this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
                if(this.others){
                  this.getNotCalendarTask()
                }else{
                  this.getStationTask();
                }
                break;
            }
          });
          break;
      }
    });
  }

  public taskFilter(): void {
    this._filterService.open(this.filter).afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this.filter = response.filter;
          if(this.filter === 0){
            this.resetFilters();
          }else{
            this.getStationTask();
          }
          break;
      }
    });
  }

  public resetFilters(): void {
    this.filter = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
    this._firstOpen = true;
    this.today = true;
    this._taskType = '0';
    this.getStationTask();
  }

  public search(): void {
    this._taskFilterNameService.open(this.taskTemplate.taskTemplates).afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this._taskType = response.data.toString();
          this.getStationTask();
          break;
        default:
          break;
      }
    });
  }

  public createStationTasks(): void {
    this._addStationService.open({
      stepActive: 3,
      stationId: this.station.id,
      disableClose: true
    });
  }

  public getNotCalendarTask(ev?: any):void{
    this.goBackList();
    let type = '1';
    if(ev){
      this._lastTabSelected = ev.index;
      switch (ev.index){
        case 0:
          type = '1';
          break;
        case 1:
          type = '3';
          break;
        case 2:
          type = '2';
          break;
      }
    }else{
      switch (this._lastTabSelected){
        case 0:
          type = '1';
          break;
        case 1:
          type = '3';
          break;
        case 2:
          type = '2';
          break;
      }
    }
    this.filters = {
      stationTaskId: this.station.stationTaskId,
      startDate: (this.start.timeStamp).toString(),
      endDate: (this.end.timeStamp).toString(),
      firstOpen: this._firstOpen,
      type: type || '1'
    };
    this._api.listUTask(this.filters).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.compareNotCalendarTasks(response.items);
          }else{
            this.notCalendarTasks = [];
          }
          break;
        default:
          this.notCalendarTasks = [];
          break;
      }
    });
  }

  private compareNotCalendarTasks(tasks: any):void{
    this.notCalendarTasks = [];
    tasks.forEach(task => {
      this.notCalendarTasks.push({
        id: task.id,
        date: UtilitiesService.convertDate(task.date),
      });
    });
  }

  public goTaskInfo(task: any, type?:number): void{
    if(!this.others){
      if(task.original.status === 3 && this.user.role !== 7){
        return;
      }
      this.taskElement = task;
      this.typeReportView = task.original.typeReport;
      this.reportView = true;
    }else{
      this.taskElement = task;
      this.typeReportView = type;
      this.reportView = true;
    }
  }

  public goBackList(): void{
    this.taskElement = null;
    this.typeReportView = 0;
    this.reportView = false;
  }

  public closeOthers(): void{
    this._lastTabSelected = 0;
    this.notCalendarTasks = null;
    this.goBackList();
    this.others = false;
  }
}
