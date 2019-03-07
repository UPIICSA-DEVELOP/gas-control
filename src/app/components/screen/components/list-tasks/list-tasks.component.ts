/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DatepickerService, DateRangeOptions} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalProceduresService} from '@app/components/screen/components/modal-procedures/modal-procedures.service';
import {FRReport, HWCReport, IncidenceReport} from '@app/core/interfaces/interfaces';
import {DOCUMENT} from '@angular/common';
import {TaskFilterNameService} from '@app/components/screen/components/task-filter-name/task-filter-name.service';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, DoCheck , OnDestroy{
  public station: any;
  @Input() set stationInfo(stationObj: any) {
    if (stationObj) {
      this.others = false;
      this.tasks = [];
      this.notCalendarTasks = [];
      this._indexOldTaskExpanded = null;
      this.station = stationObj;
      this.getStationTask();
    }else{
      this.others = false;
      this.tasks = [];
      this.notCalendarTasks = [];
      this._indexOldTaskExpanded = null;
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
  private _indexTask: number;
  public load: boolean;
  public user: any;
  public notCalendar: boolean;
  public secondTaskForm: FormGroup[];
  public taskWithDivider: any[];
  public date: any[];
  public others: boolean;
  public notCalendarTasks: any[];
  /**
   *  Start: task entity
   */
  public reportFR: FRReport;
  public reportHWC: HWCReport;
  public reportIncidence: IncidenceReport;
  /**
   *  End: task entity
   */
  public procedures: number[];
  private _indexOldTaskExpanded: number;
  private _firstOpen: boolean;
  private _taskType: string;
  private _taskListPaged: any;
  public typeReportView: number;
  public reportView: boolean;
  public taskElement: any;

  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _addStationService: AddStationService,
    private _formBuilder: FormBuilder,
    private _modalProceduresService: ModalProceduresService,
    private _taskFilterNameService: TaskFilterNameService,
    private _sharedService: SharedService,
    private _imageVisorService: ImageVisorService,
    private _snackBarService: SnackBarService
  ) {
    this.typeReportView = 0;
    this.reportView = false;
    this.itemsTasks = [];
    this._indexTask = 0;
    this.others = false;
    this.date = [];
    this.taskWithDivider = [];
    this._indexOldTaskExpanded = 0;
    this.secondTaskForm = [undefined,undefined,undefined];
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
    this.initForms();
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => this.load = load);
    if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
      this.today = true;
    }
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
  }

  ngDoCheck(): void {
    this.notCalendar = LocalStorageService.getItem(Constants.NotCalendarTask);
  }

  ngOnDestroy(): void{
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private checkChanges():void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification)=>{
      switch (response.type){
        case SharedTypeNotification.NotCalendarTask:
          this.others = true;
          this.getNotCalendarTask();
          break;
      }
    })
  }

  private getStationTask(): void {
    this._indexOldTaskExpanded = null;
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
          //this.notCalendar = true;
          //this.taskCreated = true;
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
    /*if(!this._taskListPaged.lastIndex){

    }else{
      this.tasks.forEach((task, index) => {
        if(index>this._taskListPaged.lastIndex && index<this._taskListPaged.lastIndex+10){
          this.taskTemplate.taskTemplates.forEach(template => {
            if (task.type === Number(template.id)) {
              this.tasksFilterd.push({
                id: task.id,
                type: task.type,
                date: UtilitiesService.convertDate(task.date),
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
        }else{
          this._taskListPaged.lastIndex = index;
          this._taskListPaged.list = this.tasks;
        }
      });
    }*/
    this.sortTaskArrayByStatus();
  }

  public sortTaskArrayByStatus(): void {
    let historyArray = [];
    for(let i = 0; i<this.tasksFilterd.length; i++){
      if(this.tasksFilterd[i].status === 3 || this.tasksFilterd[i].status === 4){
        historyArray.push(this.tasksFilterd[i]);
        this.tasksFilterd.splice(i, 1);
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
            id: '',
            expanded: false,
          });
        }
        headerToday = true;
        this.taskWithDivider.push({
          type: 2,
          title: '',
          original: item,
          id: item.id,
          expanded: false,
        });
      } else if (item.status === 2) {
        if (!headerPrevious && this.filter === 0){
          this.taskWithDivider.push({
            type: 1,
            title: 'Atrasadas',
            original: null,
            id: '',
            expanded: false,
          });
          headerPrevious = true;
          this.taskWithDivider.push({
            type: 2,
            title: '',
            original: item,
            id: item.id,
            expanded: false,
          });
        } else {
          this.taskWithDivider.push({
            type: 2,
            title: '',
            original: item,
            id: item.id,
            expanded: false,
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
          id: '',
          expanded: false,
        });
      }
      for(let i = 0; i< historyArray.length; i++){
        this.taskWithDivider.push({
          type: 2,
          title: '',
          original: historyArray[i],
          id: historyArray[i].id,
          expanded: false,
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

  public getTaskInformation(index: number, id: string, type: number, hwg?: boolean): void {
    if(this.others){
      this.notCalendarTasks[index].expanded = true;
      if (this._indexOldTaskExpanded !== null && this._indexOldTaskExpanded !== index) {
        this.notCalendarTasks[this._indexOldTaskExpanded].expanded = false;
      }
      this._indexOldTaskExpanded = index;
      this._api.getTaskInformation(id, type).subscribe(response => {
        switch (response.code) {
          case 200:
            if (response.items) {
              this.itemsTasks = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
              this._indexTask = 0;
              this.patchForms(type, this.itemsTasks[0]);
            } else {
              this.resetElements();
            }
            break;
        }
      });
    }else{
      this.taskWithDivider[index].expanded = true;
      if (this._indexOldTaskExpanded !== null && this._indexOldTaskExpanded !== index) {
        this.taskWithDivider[this._indexOldTaskExpanded].expanded = false;
      }
      this._indexOldTaskExpanded = index;
      this._api.getTaskInformation(id, type).subscribe(response => {
        switch (response.code) {
          case 200:
            if (response.items) {
              this.itemsTasks = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
              this._indexTask = 0;
              this.patchForms(type, this.itemsTasks[0]);
            } else {
              this.resetElements();
            }
            break;
        }
      });
    }
  }

  private initForms(): void {
    this.initFRForm();
    this.initHWCForm();
    this.initIncidenceForm();
  }

  private resetElements(): void {
    this.reportFR = null;
    this.reportHWC = null;
    this.reportIncidence = null;
    this.secondTaskForm[0].reset();
    this.secondTaskForm[1].reset();
    this.secondTaskForm[2].reset();
    this.secondTaskForm[0].disable();
    this.secondTaskForm[1].disable();
    this.secondTaskForm[2].disable();
  }

  private patchForms(type: number, taskEntity: any) {
    switch (type) {
      case 6:
        this.patchHWCForm(taskEntity);
        break;
      case 7:
        this.patchFRForm(taskEntity);
        break;
      case 9:
        this.patchIncidenceForm(taskEntity);
        break;
    }
  }

  public getNotCalendarTask(ev?: any):void{
    this._indexOldTaskExpanded = null;
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
            const tasks = response.items;
            this.compareNotCalendarTasks(tasks)
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
        expanded: false
      });
    });
  }

  private initFRForm():void{
    this.secondTaskForm[0] = this._formBuilder.group({
      startTime: ['',[]],
      endTime: ['',[]],
      remissionNumber: ['',[]],
      remission: ['',[]],
      volumetric: ['',[]],
      magna:[false,[]],
      premium: [false,[]],
      diesel: [false,[]],
      receiveName: ['',[]]
    });
  }

  private initHWCForm():void{
    this.secondTaskForm[1] = this._formBuilder.group({
      waste:['',[]],
      quantity: ['',[]],
      unity: ['',[]],
      carrierCompany: ['',[]],
      finalDestination: ['',[]]
    });
  }

  private initIncidenceForm():void{
    this.secondTaskForm[2] = this._formBuilder.group({
      time: ['',[]],
      area: ['',[]],
      description: ['',[]],
    });
  }

  private patchFRForm(task: any):void{
    this.reportFR = {
      date: task.date || undefined,
      diesel: task.diesel || false,
      endTime: task.endTime || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      magna: task.magna || false,
      managerName: task.managerName || undefined,
      name: task.name || undefined,
      premium: task.premium || false,
      receiveName: task.receiveName || undefined,
      remission: task.remission || undefined,
      remissionNumber: task.remissionNumber || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined,
      volumetric: task.volumetric || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportFR.date);
    this.secondTaskForm[0].patchValue({
      startTime: this.reportFR.startTime,
      endTime: this.reportFR.endTime,
      remissionNumber: this.reportFR.remissionNumber,
      remission: this.reportFR.remission,
      volumetric: this.reportFR.volumetric,
      magna: this.reportFR.magna,
      premium: this.reportFR.premium,
      diesel: this.reportFR.diesel,
      receiveName: this.reportFR.receiveName
    });
    this.secondTaskForm[0].disable();
  }

  private patchHWCForm(task: any):void{
    this.reportHWC = {
      carrierCompany: task.carrierCompany || undefined,
      date: task.date || undefined,
      finalDestination: task.finalDestination || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      manifest: task.manifest || undefined,
      manifestNumber: task.manifestNumber || undefined,
      name: task.name || undefined,
      nextPhase: task.nextPhase || undefined,
      quantity: task.quantity || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportHWC.date);
    this.secondTaskForm[1].patchValue({
      waste: this.reportHWC.waste,
      quantity: this.reportHWC.quantity,
      unity: this.reportHWC.unity,
      carrierCompany: this.reportHWC.carrierCompany,
      finalDestination: this.reportHWC.finalDestination
    });
    this.secondTaskForm[1].disable();
  }

  private patchIncidenceForm(task: any):void{
    this.reportIncidence = {
      area: task.area || undefined,
      date: task.date || undefined,
      description: task.description || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      procedures: task.procedures || [''],
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      time: task.time || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportIncidence.date);
    this.secondTaskForm[2].patchValue({
      time: this.reportIncidence.time,
      area: this.reportIncidence.area,
      description: this.reportIncidence.description
    });
    this.secondTaskForm[2].disable();
  }

  public seeEvidence():void{
    if(this.itemsTasks[this._indexTask].fileCS){
      this._imageVisorService.open(this.itemsTasks[this._indexTask].fileCS);
    }else{
      this._snackBarService.openSnackBar('Esta tarea no cuenta con evidencia', 'OK',3000);
    }
  }

  public goTaskInfo(task: any): void{
    //if(task.original.status === 3 && this.user.role !== 7){
      //return;
    //}
    this.taskElement = task;
    this.typeReportView = task.original.typeReport;
    this.reportView = true;
  }

  public goBackList(): void{
    this.taskElement = null;
    this.typeReportView = 0;
    this.reportView = false;
  }
}
