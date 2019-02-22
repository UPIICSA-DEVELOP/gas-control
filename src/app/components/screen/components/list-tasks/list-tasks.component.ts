/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
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
import {CompressorReport, FEReport, FRReport, HWCReport, HWGReport, IncidenceReport, OMReport, ScannedReport, VRSReport} from '@app/core/interfaces/interfaces';
import {DOCUMENT} from '@angular/common';
import {TaskFilterNameService} from '@app/components/screen/components/task-filter-name/task-filter-name.service';

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
  @ViewChild('listTask') private _listTask: ElementRef;
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
  public taskForm: FormGroup[];
  /**
   *  Start: task entity
   */
  public reportOM: OMReport;
  public reportComp: CompressorReport;
  public reportHWG: HWGReport;
  public reportVRS: VRSReport;
  public reportScanned: ScannedReport;
  public reportFE: FEReport;
  /**
   *  End: task entity
   */
  public personnelNames: string[];
  public procedures: number[];
  private _indexOldTaskExpanded: number;
   constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _addStationService: AddStationService,
    private _formBuilder: FormBuilder,
    private _modalProceduresService: ModalProceduresService,
    private _taskFilterNameService: TaskFilterNameService
  ) {
     this.personnelNames = [''];
    this._indexOldTaskExpanded = 0;
    this.taskForm = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
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
    this.initForms();
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

  public test(ev: string, type: string):void{
    this.taskForm[0].patchValue({
      [type]: ev
    });
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
            id: task.id,
            type: task.type,
            date: UtilitiesService.convertDate(task.date),
            name: template.name,
            zone: template.zone,
            level: template.level,
            hwg: template.hwg,
            typeReport: template.typeReport,
            expanded: false
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
    this._taskFilterNameService.open(this.taskTemplate.taskTemplates);
  }

  public createStationTasks():void{
    this._addStationService.open({
      stepActive: 3,
      stationId: this.station.id,
      disableClose: true
    });
  }

  public getTaskInformation(index: number, id: string, type: number, hwg: boolean): void{
    this.tasksFilterd[index].expanded = true;
    if(this._indexOldTaskExpanded !== null){
      this.tasksFilterd[this._indexOldTaskExpanded].expanded = false;
    }
    this._indexOldTaskExpanded = index;
    this._api.getTaskInformation(id, type).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.patchForms(type,response.items[0],hwg);
          }else{
            this.resetElements();
          }
          break;
      }
    })
  }

  private initForms():void{
    this.initOMForm();
    this.initCompressorForm();
    this.initHWGForm();
    this.initVRSForm();
  }

  private resetElements():void{
     this.reportOM = null;
     this.reportComp = null;
     this.reportHWG = null;
     this.reportVRS = null;
     this.reportScanned = null;
     this.reportFE = null;
     this.taskForm[0].reset();
     this.taskForm[1].reset();
     this.taskForm[2].reset();
     this.taskForm[3].reset();
     if(this.user.role !== 7){
       this.taskForm[0].disable();
       this.taskForm[1].disable();
       this.taskForm[2].disable();
       this.taskForm[3].disable();
       //this.taskForm[4].disable();
     }
     // this.taskForm[4].reset();
  }

  private initOMForm():void{
    this.taskForm[0] = this._formBuilder.group({
      startTime:['',[Validators.required]],
      endTime:['',[Validators.required]],
      maintenanceType:['',[Validators.required]],
      activityType:['',[Validators.required]],
      personnelType:['',[Validators.required]],
      cottonClothes:[false, []],
      faceMask:[false, []],
      gloves:[false, []],
      kneepads:[false, []],
      protectiveGoggles:[false, []],
      industrialShoes:[false, []],
      goggles:[false, []],
      helmet:[false, []],
      toolsAndMaterials: ['',[]],
      managerName:['',[]],
      observations:['',[]]
    })
  }

  private initCompressorForm():void{
    this.taskForm[1] = this._formBuilder.group({
      startTime:['',[Validators.required]],
      endTime:['',[Validators.required]],
      brand: ['',[]],
      model:['',[]],
      controlNumber:['',[]],
      pressure:['',[Validators.required]],
      purge:['',[Validators.required]],
      securityValve:['',[Validators.required]],
      modifications:['',[]],
      observations:['',[]]
    })
  }

  private initHWGForm():void{
     this.taskForm[2] = this._formBuilder.group({
       area:['',[Validators.required]],
       waste:['',[Validators.required]],
       corrosive:['',[]],
       reactive:['',[]],
       explosive:['',[]],
       toxic:['',[]],
       flammable:['',[]],
       quantity:['',[Validators.required]],
       unity:['',[Validators.required]],
       temporaryStorage:['',[Validators.required]]
     });
  }

  private initVRSForm():void{
    this.taskForm[3] = this._formBuilder.group({
      magna:[false,[]],
      premium:[false,[]],
      fuelNozzle:['',[]],
      longHose:['',[]],
      breakAway:['',[]],
      shortHose:['',[]],
      equipment:['',[]],
      vrsAlarm:['',[]],
      emergencyStop:['',[]],
      observations:['',[]]
    })
  }

  private initFEForm():void{
    this.taskForm[4] = this._formBuilder.group({})
  }

  public openProcedures():void{
    this._modalProceduresService.open(this.taskTemplate.procedures)
  }

  private patchForms(type: number, taskEntity: any, isHWG: boolean){
    switch (type){
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
      case 8:
        this.patchFEForm(taskEntity);
        break;
    }
  }

  private patchOMForm(task:any):void{
    this.reportOM = {
      activityType: task.activityType,
      cottonClothes: task.cottonClothes,
      date: task.date,
      endTime: task.endTime,
      faceMask: task.faceMask,
      fileCS: task.fileCS,
      folio: task.folio,
      gloves: task.gloves,
      goggles: task.goggles,
      helmet: task.helmet,
      hwgReport: task.hwgReport,
      id: task.id,
      industrialShoes: task.industrialShoes,
      kneepads: task.kneepads,
      maintenanceType: task.maintenanceType,
      managerName: task.managerName,
      observations: task.observable,
      personnelNames: task.personnelNames || [''],
      personnelType: task.personnelType,
      procedures: task.procedures,
      protectiveGoggles: task.protectiveGoggles,
      signature: task.signature,
      startTime: task.startTime,
      taskId: task.taskId,
      toolsAndMaterials: task.toolsAndMaterials
    };
    console.log(this.reportOM);
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
      managerName: this.reportOM.managerName,
      observations: this.reportOM.observations
    });
    if(this.user.role!==7){
      this.taskForm[0].disable();
    }
  }

  private patchCompressorForm(task:any):void{
    this.taskForm[1].patchValue({

    })
  }

  private patchHWGForm(task:any):void{
     this.taskForm[2].patchValue({

     })
  }

  private patchVRSForm(task:any):void{
    this.taskForm[3].patchValue({

    })
  }

  private patchScannedForm(task:any):void{

  }

  private patchFEForm(task:any):void{
    this.taskForm[4].patchValue({

    })
  }

}
