/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {DatepickerService} from '@app/core/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/core/components/task-filter/task-filter.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  public startDate: string = new Date().toLocaleDateString();
  public endDate: string = new Date().toLocaleDateString();
  public today: boolean = false;
  public typeFilter: string[] = ['Todas','Atrasadas','Terminadas','Vencidas','Incidencias'];
  public filterApply:string;
  public filter: number = 0;
  constructor(
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
  ) { }

  ngOnInit() {
    if (this.startDate === this.endDate) {
      this.today = true;
    }this.filterApply = this.typeFilter[this.filter];
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
}
