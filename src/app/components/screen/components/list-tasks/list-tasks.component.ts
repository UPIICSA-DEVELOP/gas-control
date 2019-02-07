/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DatepickerService} from '@app/components/screen/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/components/screen/components/task-filter/task-filter.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {template} from '@angular/core/src/render3';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, OnChanges {
  @Input() public station: any;
  @Input() public taskTemplate: any;
  @ViewChild('searchBox') private _searchBox: ElementRef;
  @ViewChild('input') private _input: ElementRef;
  public startDate: string = new Date().toLocaleDateString();
  public endDate: string = new Date().toLocaleDateString();
  public today: boolean = false;
  public showSearchBox: boolean;
  public tasks: any[];
  public tasksFilterd: any[];
  public copyTasks: any[];
  public zones: any[];
  public priority: any[];
  public typeFilter: string[] = ['Todas','Atrasadas','Terminadas','Vencidas','Incidencias'];
  public filterApply:string;
  public filter: number = 0;
  public load: boolean;
  constructor(
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService
  ) {
    this.tasksFilterd = [];
    this.copyTasks = [];
    this.priority = Constants.Level;
    this.zones = Constants.Zones;
  }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load=load});
    if (this.startDate === this.endDate) {
      this.today = true;
    }this.filterApply = this.typeFilter[this.filter];
  }

  ngOnChanges(changes: SimpleChanges):void{
    if (this.station){
      this.getStationTask();
    }
  }

  private getStationTask():void{
    this._api.listTaskDateStatus(this.station.stationTaskId || '123').subscribe(response=>{
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
    this.tasks.forEach(task => {
      this.taskTemplate.taskTemplates.forEach(template => {
        if(task.type === Number(template.id)){
          this.tasksFilterd.push({
            type: task.type,
            date: UtilitiesService.convertDate(task.date),
            name: template.name,
            zone: template.zone,
            level: template.level,
            typeReport: template.typeReport
          });
        }
        this.copyTasks = this.tasksFilterd;
      });
    });
  }

  public dateFilter():void{
    this._dateService.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          if (response.startDate == response.endDate) {
            this.today = true;
          } else {
            this.today=false;
            this.startDate = response.startDate;
            this.endDate = response.endDate;
          }
          break;
      }
    });
  }

  public taskFilter():void{
    this._filterService.open(this.filter).afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.filter = response.filter;
          this.filterApply = this.typeFilter[this.filter];
          break;
      }
    })
  }

  public resetFilters():void{
    this.filter=0;
    this.filterApply = this.typeFilter[this.filter];
    this.startDate = new Date().toLocaleDateString();
    this.endDate = new Date().toLocaleDateString();
    this.today = true;
  }

  public search(): void{
    if(!this.showSearchBox){
      this.showSearchBox = !this.showSearchBox;
      this._searchBox.nativeElement.style.width = '100%';
    }else{
      console.log(this._input.nativeElement.value);
      this._input.nativeElement.value = '';
      console.log(this._input.nativeElement.value);
      this._searchBox.nativeElement.style.width = '0';
      setTimeout(() => {
        this.showSearchBox = !this.showSearchBox;
      }, 250);
    }
  }

  public searchTask(event:any):void{
    const newArray = [];
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
}
