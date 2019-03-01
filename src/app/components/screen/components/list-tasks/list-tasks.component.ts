/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Inject, Input, OnInit} from '@angular/core';
import {DatepickerService, DateRangeOptions} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalProceduresService} from '@app/components/screen/components/modal-procedures/modal-procedures.service';
import {
  CompressorReport, FEReport, FRReport, HWCReport, HWGReport, IncidenceReport, OMReport, ScannedReport,
  VRSReport
} from '@app/core/interfaces/interfaces';
import {DOCUMENT} from '@angular/common';
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
    if (stationObj && stationObj.stationTaskId) {
      this.others = false;
      this.notCalendarTasks = [];
      this._indexOldTaskExpanded = null;
      this.station = stationObj;
      this.getStationTask();
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
  public load: boolean;
  public user: any;
  public notCalendar: boolean;
  public taskForm: FormGroup[];
  public secondTaskForm: FormGroup[];
  public taskWithDivider: any[];
  public date: any[];
  public others: boolean;
  public notCalendarTasks: any[];
  /**
   *  Start: task entity
   */
  public reportOM: OMReport;
  public reportComp: CompressorReport;
  public reportHWG: HWGReport;
  public reportVRS: VRSReport;
  public reportScanned: ScannedReport;
  public reportFE: FEReport;
  //////////////////
  public reportFR: FRReport;
  public reportHWC: HWCReport;
  public reportIncidence: IncidenceReport;
  /**
   *  End: task entity
   */
  public personnelNames: string[];
  public procedures: number[];
  private _indexOldTaskExpanded: number;
  private _firstOpen: boolean;
  private _taskType: string;
  private _taskListPaged: any;
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
    private _sharedService: SharedService
  ) {
    this.others = false;
    this.date = [];
    this.personnelNames = [''];
    this.taskWithDivider = [];
    this._indexOldTaskExpanded = 0;
    this.secondTaskForm = [undefined,undefined,undefined];
    this.taskForm = [undefined, undefined, undefined, undefined, undefined];
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
          this.others = true;
          this.getNotCalendarTask();
          break;
      }
    })
  }

  public test(ev: string, type: string): void {
    this.taskForm[0].patchValue({
      [type]: ev
    });
  }

  private getStationTask(): void {
    this.filters = {
      stationTaskId: this.station.stationTaskId,
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

  public onScroll(event: any):void{
    const element = event.srcElement;
    if(element.scrollHeight - element.scrollTop === element.clientHeight) {
      if(!this.load){
        this.tasksCompare();
      }
    }
  }

  public sortTaskArrayByStatus(): void {
    let headerPrevious = false, headerHistory = false, headerToday = false;
    this.tasksFilterd = UtilitiesService.sortJSON(this.tasksFilterd, 'status', 'asc');
    this.tasksFilterd.forEach(item => {
      if (item.status === 1) {
        if(!headerToday){
          this.taskWithDivider.push({
            type: this.filter!==0 ? 2 : 1,
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
        if (!headerPrevious) {
          this.taskWithDivider.push({
            type: this.filter!==0 ? 2 : 1,
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
      } else if (item.status === 3 || item.status === 4) {
        if (!headerHistory) {
          this.taskWithDivider.push({
            type: this.filter!==0 ? 2 : 1,
            title: 'Historial',
            original: null,
            id: '',
            expanded: false,
          });
          headerHistory = true;
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
          if (this.filter !== 0 && ((this.start.timeStamp === this.end.timeStamp) && this._taskType === '0')){
            this._firstOpen = false;
          }
          this.getStationTask();
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
      if (this._indexOldTaskExpanded !== null) {
        this.notCalendarTasks[this._indexOldTaskExpanded].expanded = false;
      }
      this._indexOldTaskExpanded = index;
      this._api.getTaskInformation(id, type).subscribe(response => {
        console.log(response);
        switch (response.code) {
          case 200:
            if (response.items) {
              const items = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
              this.patchForms(type, items[0], hwg);
            } else {
              this.resetElements();
            }
            break;
        }
      });
    }else{
      this.taskWithDivider[index].expanded = true;
      if (this._indexOldTaskExpanded !== null) {
        this.taskWithDivider[this._indexOldTaskExpanded].expanded = false;
      }
      this._indexOldTaskExpanded = index;
      this._api.getTaskInformation(id, type).subscribe(response => {
        switch (response.code) {
          case 200:
            if (response.items) {
              const items = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
              this.patchForms(type, items[0], hwg);
            } else {
              this.resetElements();
            }
            break;
        }
      });
    }
  }

  private initForms(): void {
    this.initOMForm();
    this.initCompressorForm();
    this.initHWGForm();
    this.initVRSForm();
    this.initFEForm();
    this.initFRForm();
    this.initHWCForm();
    this.initIncidenceForm();
  }

  private resetElements(): void {
    this.reportOM = null;
    this.reportComp = null;
    this.reportHWG = null;
    this.reportVRS = null;
    this.reportScanned = null;
    this.reportFE = null;
    this.reportFR = null;
    this.reportHWC = null;
    this.reportIncidence = null;
    this.taskForm[0].reset();
    this.taskForm[1].reset();
    this.taskForm[2].reset();
    this.taskForm[3].reset();
    this.taskForm[4].reset();
    this.secondTaskForm[0].reset();
    this.secondTaskForm[1].reset();
    this.secondTaskForm[2].reset();
    this.taskForm[0].disable();
    this.taskForm[1].disable();
    this.taskForm[2].disable();
    this.taskForm[3].disable();
    this.taskForm[4].disable();
    this.secondTaskForm[0].disable();
    this.secondTaskForm[1].disable();
    this.secondTaskForm[2].disable();
  }

  private initOMForm(): void {
    this.taskForm[0] = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      maintenanceType: ['', [Validators.required]],
      activityType: ['', [Validators.required]],
      personnelType: ['', [Validators.required]],
      cottonClothes: [false, []],
      faceMask: [false, []],
      gloves: [false, []],
      kneepads: [false, []],
      protectiveGoggles: [false, []],
      industrialShoes: [false, []],
      goggles: [false, []],
      helmet: [false, []],
      toolsAndMaterials: ['', []],
      description: ['', []],
      observations: ['', []]
    });
  }

  private initCompressorForm(): void {
    this.taskForm[1] = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      brand: ['', []],
      model: ['', []],
      controlNumber: ['', []],
      pressure: ['', [Validators.required]],
      purge: ['', [Validators.required]],
      securityValve: ['', [Validators.required]],
      modifications: ['', []],
      observations: ['', []]
    });
  }

  private initHWGForm(): void {
    this.taskForm[2] = this._formBuilder.group({
      area: ['', [Validators.required]],
      waste: ['', [Validators.required]],
      corrosive: ['', []],
      reactive: ['', []],
      explosive: ['', []],
      toxic: ['', []],
      flammable: ['', []],
      quantity: ['', [Validators.required]],
      unity: ['', [Validators.required]],
      temporaryStorage: ['', [Validators.required]]
    });
  }

  private initVRSForm(): void {
    this.taskForm[3] = this._formBuilder.group({
      magna: [false, []],
      premium: [false, []],
      fuelNozzle: ['', []],
      longHose: ['', []],
      breakAway: ['', []],
      shortHose: ['', []],
      equipment: ['', []],
      vrsAlarm: ['', []],
      emergencyStop: ['', []],
      observations: ['', []]
    });
  }

  private initFEForm(): void {
    this.taskForm[4] = this._formBuilder.group({
      startTime: ['',[]],
      endTime:['',[]]
    });
  }

  public openProcedures(): void {
    this._modalProceduresService.open(this.taskTemplate.procedures);
  }

  private patchForms(type: number, taskEntity: any, isHWG?: boolean) {
    switch (type) {
      case 1:
        this.patchOMForm(taskEntity);
        break;
      case 2:
        this.patchCompressorForm(taskEntity);
        break;
      case 4:
        this.patchVRSForm(taskEntity);
        break;
      case 5:
        this.patchScannedForm(taskEntity);
        break;
      case 6:
        this.patchHWCForm(taskEntity);
        break;
      case 7:
        this.patchFRForm(taskEntity);
        break;
      case 8:
        this.patchFEForm(taskEntity);
        break;
      case 9:
        this.patchIncidenceForm(taskEntity);
        break;
    }
    if (isHWG) {
      this.patchHWGForm(taskEntity.hwgReport);
    }
  }

  private patchOMForm(task: any): void {
    this.reportOM = {
      activityType: task.activityType || undefined,
      cottonClothes: task.cottonClothes || false,
      date: task.date || undefined,
      description: task.description || undefined,
      endTime: task.endTime || undefined,
      faceMask: task.faceMask || false,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      gloves: task.gloves || false,
      goggles: task.goggles || false,
      helmet: task.helmet || false,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      industrialShoes: task.industrialShoes || false,
      kneepads: task.kneepads || false,
      maintenanceType: task.maintenanceType || undefined,
      managerName: task.managerName || undefined,
      name: task.name || undefined,
      observations: task.observable || undefined,
      personnelNames: task.personnelNames || [''],
      personnelType: task.personnelType || undefined,
      procedures: task.procedures || [],
      protectiveGoggles: task.protectiveGoggles || false,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined,
      toolsAndMaterials: task.toolsAndMaterials || undefined
    };
    this.taskForm[0].patchValue({
      startTime: this.reportOM.startTime,
      endTime: this.reportOM.endTime,
      maintenanceType: this.reportOM.maintenanceType,
      activityType: this.reportOM.activityType,
      personnelType: this.reportOM.personnelType,
      cottonClothes: this.reportOM.cottonClothes,
      faceMask: this.reportOM.faceMask,
      gloves: this.reportOM.gloves,
      kneepads: this.reportOM.kneepads,
      protectiveGoggles: this.reportOM.protectiveGoggles,
      industrialShoes: this.reportOM.industrialShoes,
      goggles: this.reportOM.goggles,
      helmet: this.reportOM.helmet,
      toolsAndMaterials: this.reportOM.toolsAndMaterials,
      description: this.reportOM.description,
      observations: this.reportOM.observations
    });
    this.date = UtilitiesService.convertDate(this.reportOM.date);
    if (this.user.role !== 7) {
      this.taskForm[0].disable();
    }
  }

  private patchCompressorForm(task: any): void {
    this.reportComp = {
      brand: task.brand || undefined,
      controlNumber: task.controlNumber || undefined,
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      model: task.model || undefined,
      modifications: task.modifications || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      pressure: task.pressure || undefined,
      purge: task.purge || undefined,
      securityValve: task.securityValve || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportComp.date);
    this.taskForm[1].patchValue({
      startTime: this.reportComp.startTime,
      endTime: this.reportComp.endTime,
      brand: this.reportComp.brand,
      model: this.reportComp.model,
      controlNumber: this.reportComp.controlNumber,
      pressure: this.reportComp.pressure,
      purge: this.reportComp.purge,
      securityValve: this.reportComp.securityValve,
      modifications: this.reportComp.modifications,
      observations: this.reportComp.observations
    });
    if (this.user.role !== 7) {
      this.taskForm[1].disable();
    }
  }

  private patchHWGForm(task: any): void {
    this.reportHWG = {
      area: task.area || undefined,
      corrosive: task.corrosive || false,
      explosive: task.explosive || false,
      fileCS: task.fileCS || undefined,
      flammable: task.flammable || false,
      quantity: task.quantity || undefined,
      reactive: task.reactive || false,
      temporaryStorage: task.temporaryStorage || undefined,
      toxic: task.toxic || false,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    };
    this.taskForm[2].patchValue({
      area: this.reportHWG.area,
      waste: this.reportHWG.waste,
      corrosive: this.reportHWG.corrosive,
      reactive: this.reportHWG.reactive,
      explosive: this.reportHWG.explosive,
      toxic: this.reportHWG.toxic,
      flammable: this.reportHWG.flammable,
      quantity: this.reportHWG.quantity,
      unity: this.reportHWG.unity,
      temporaryStorage: this.reportHWG.temporaryStorage
    });
    if (this.user.role !== 7) {
      this.taskForm[2].disable();
    }
  }

  private patchVRSForm(task: any): void {
    this.reportVRS = {
      date: task.date || undefined,
      emergencyStop: task.emergencyStop || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      vrsAlarm: task.vrsAlarm || undefined,
      vrsDispensary: task.vrsDispensary || undefined,
      vrsTanks: task.vrsTanks || [{
        capAndFillingAdapter: undefined,
        capAndSteamAdapter: undefined,
        fuelType: undefined,
        overfillValve: undefined,
        vacuumPressureValve: undefined
      }]
    };
    this.date = UtilitiesService.convertDate(this.reportVRS.date);
    this.taskForm[3].patchValue({
      magna: this.reportVRS.vrsDispensary.magna,
      premium: this.reportVRS.vrsDispensary.premium,
      fuelNozzle: this.reportVRS.vrsDispensary.fuelNozzle,
      longHose: this.reportVRS.vrsDispensary.longHose,
      breakAway: this.reportVRS.vrsDispensary.breakAway,
      shortHose: this.reportVRS.vrsDispensary.shortHose,
      equipment: this.reportVRS.vrsDispensary.equipment,
      vrsAlarm: this.reportVRS.vrsAlarm,
      emergencyStop: this.reportVRS.emergencyStop,
      observations: this.reportVRS.observations
    });
    if (this.user.role !== 7) {
      this.taskForm[3].disable();
    }
  }

  private patchScannedForm(task: any): void {
    this.reportScanned = {
      date: task.date || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportScanned.date);
  }

  private patchFEForm(task: any): void {
    this.reportFE = {
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fireExtinguishers: task.fireExtinguishers || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.date = UtilitiesService.convertDate(this.reportFE.date);
    this.taskForm[4].patchValue({
      startTime: this.reportFE.startTime,
      endTime: this.reportFE.endTime
    });
    this.taskForm[4].disable();
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
    console.log(this.notCalendarTasks);
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
}
