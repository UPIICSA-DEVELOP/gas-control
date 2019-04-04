/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-task-filter-name',
  templateUrl: './task-filter-name.component.html',
  styleUrls: ['./task-filter-name.component.scss']
})
export class TaskFilterNameComponent implements OnInit {
  public taskName: any[];
  public taskSelected: number;
  public emptyList: boolean;
  private _taskTemplate: any[];
  private _taskCopy: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<TaskFilterNameComponent>
  ) {
    this.emptyList = false;
    this._taskCopy = [];
    this._taskTemplate = this._data.utils;
    this.taskSelected = this._data.lastTypeSelected || 0;
    this.taskName = [];
  }

  ngOnInit() {
    this.getTasks();
  }

  private getTasks():void{
    this.taskName.push({id: 0, name: 'Todas'});
    for (let i = 0; i < this._taskTemplate.length; i++){
      if(this._taskTemplate[i].typeReport !== 6 && this._taskTemplate[i].typeReport !== 7 && this._taskTemplate[i].typeReport !== 9)
      this.taskName.push({id: Number(this._data.utils[i].id), name: this._data.utils[i].name});
    }
    this._taskCopy = this.taskName;
  }

  public cancel():void{
    this._dialogRef.close({code: -1});
  }

  public apply():void{
    this._dialogRef.close({code: 1, data: this.taskSelected});
  }

  public searchTask(event:any):void{
    const newArray = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.taskName = this._taskCopy;
    }else{
      for(let x=0; x < this._taskCopy.length; x++){
        if(UtilitiesService.removeDiacritics(this._taskCopy[x].name).toLowerCase().includes(text)){
          newArray.push(this._taskCopy[x]);
        }
      }
      if(newArray.length > 0){
        this.taskName = newArray;
        this.emptyList = false;
      }else{
        this.taskName = newArray;
        this.emptyList = (newArray.length === 0);
      }
    }
  }
}
