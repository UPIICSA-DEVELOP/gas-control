/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {OpenFileService} from '@app/shared/components/open-file/open-file.service';
import {DatepickerService, DateRangeOptions} from '@app/ui/dashboard/components/datepicker/datepicker.service';
import {TaskFilterService} from '@app/ui/dashboard/components/task-filter/task-filter.service';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';
import {TaskFilterNameService} from '@app/ui/dashboard/components/task-filter-name/task-filter-name.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {Report} from '@app/utils/interfaces/report';
import {TaskLists} from '@app/utils/interfaces/task-lists';
import {Station} from '@app/utils/interfaces/station';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {EntityResponse} from '@app/utils/class/entity-response';
import {StationTask} from '@app/utils/interfaces/station-task';
import {LocalStorageService} from 'ng-maplander';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit, OnDestroy {
  @ViewChild('modalScroll', {static: false}) private _modalScroll: ElementRef;
  public station: Station;

  @Input() set stationInfo(stationObj: any) {
    if (stationObj) {
      this.finishCreateTasks = false;
      this.others = false;
      this._token = undefined;
      this.listTask = {todayTasks: [], previousTasks: [], historyTasks: [], scheduleTasks: []};
      this.goBackList();
      this.resetFilters(true);
      this.station = stationObj;
      if (this.station.stationTaskId) {
        this.notCalendar = false;
        this.getStatusTask();
      } else {
        this.notCalendar = true;
      }
    }
  }

  @Input() public utils: any;
  public startDate: Date;
  public endDate: Date;
  public filters: any;
  public start: {
    timeStamp: number,
    textDate: string,
  };
  public end: {
    timeStamp: number,
    textDate: string,
  };
  public today: boolean;
  public typeFilter: string[];
  public filter: number;
  public load: boolean;
  public user: Person;
  public notCalendar: boolean;
  public date: any[];
  public others: boolean;
  public notCalendarTasks: {
    id: string,
    date: string [],
    type: any,
  }[];
  public listTask: TaskLists;
  public emptyLisTasks: boolean;
  public finishCreateTasks: boolean;
  public reportConfig: Report;
  private _firstOpen: boolean;
  private _taskType: string;
  private _token: string;
  private _tokenTwo: string;
  private _lastTabSelected: number;
  private _creationDate: number;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _firstGet: boolean;

  constructor(
    private _dateService: DatepickerService,
    private _filterService: TaskFilterService,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _addStationService: AddStationService,
    private _taskFilterNameService: TaskFilterNameService,
    private _sharedService: SharedService,
    private _snackBarService: SnackBarService,
    private _openFile: OpenFileService
  ) {
    this._firstGet = false;
    this.listTask = {historyTasks: [], previousTasks: [], todayTasks: [], scheduleTasks: []};
    this.reportConfig = {reportView: false, taskElement: null, typeReportView: 0, status: 0};
    this.emptyLisTasks = true;
    this.others = false;
    this.date = [];
    this.today = false;
    this.notCalendar = false;
    this.filter = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.typeFilter = Constants.Filters;
    this._firstOpen = true;
    this._taskType = '0';
    this.notCalendarTasks = [];
    this._lastTabSelected = 0;
    this.finishCreateTasks = false;
  }

  ngOnInit() {
    this.checkChanges();
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => this.load = load);
    if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
      this.today = true;
    }
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
  }

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getStatusTask(): void {
    this._api.getStationTask(this.station.stationTaskId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.item.status === 3) {
          this.getStationTask();
        } else {
          this.createTasks(this.station.stationTaskId);
        }
      }
    });
  }

  private checkChanges(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification) => {
      switch (response.type) {
        case SharedTypeNotification.NotCalendarTask:
          if (!this.others) {
            this.resetFilters(true);
            this.others = true;
            this.notCalendarTasks = [];
            this._modalScroll.nativeElement.scrollTop = '0';
            this.getNotCalendarTask();
          }
          break;
        case SharedTypeNotification.FinishEditTask:
          this.goBackList();
          this._firstGet = true;
          if (this.others) {
            this.notCalendarTasks = [];
            this._tokenTwo = null;
            this.getNotCalendarTask();
          } else {
            this.listTask = {todayTasks: [], previousTasks: [], historyTasks: [], scheduleTasks: []};
            this._token = null;
            this.getStationTask();
          }
          break;
        case SharedTypeNotification.CreationTask:
          this.notCalendar = false;
          this.createTasks(response.value.id);
          break;
      }
    });
  }

  private getStationTask(): void {
    this.filters = {
      stationTaskId: this.station.stationTaskId || '0000',
      startDate: (this.start.timeStamp).toString(),
      status: (this.filter).toString(),
      endDate: (this.end.timeStamp).toString(),
      firstOpen: this._firstOpen,
      type: this._taskType || '',
      cursor: this._token
    };
    this.emptyLisTasks = true;
    this.finishCreateTasks = false;
    this._api.listTask(this.filters).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (this._token === response.nextPageToken) {
          this._token = null;
        } else {
          this._token = response.nextPageToken;
        }
        if (response.items) {
          this.emptyLisTasks = false;
          this.tasksCompare(response.items);
        } else {
          if (this._firstOpen && this._taskType === '0' && this.filter === 0 &&
            (this.listTask.historyTasks.length === 0 && this.listTask.previousTasks.length === 0 &&
              this.listTask.todayTasks.length === 0 && this.listTask.scheduleTasks.length === 0)) {
            this.finishCreateTasks = true;
          } else {
            this.emptyLisTasks = (this.listTask.historyTasks.length === 0 && this.listTask.previousTasks.length === 0 &&
              this.listTask.todayTasks.length === 0 && this.listTask.scheduleTasks.length === 0);
          }
        }
      } else {
      }
    });
  }

  private tasksCompare(tasksList: any): void {
    let mergeTasks: any[] = [];
    tasksList.forEach(task => {
      this.utils.taskTemplates.forEach(template => {
        if (task.type === Number(template.id)) {
          mergeTasks.push({
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
            evidence: template.evidence,
            frequency: template.frequency
          });
        }
      });
    });
    mergeTasks = UtilitiesService.sortJSON(mergeTasks, 'originalDate', 'desc');
    this.sortTaskArrayByStatus(mergeTasks);
  }

  public sortTaskArrayByStatus(tasksList: any): void {
    const today = UtilitiesService.createPersonalTimeStamp(new Date());
    tasksList.forEach(task => {
      if (task.status === 1) {
        if (today.timeStamp < task.originalDate) {
          if (this.listTask.scheduleTasks.length === 0) {
            this.listTask.scheduleTasks.push({type: 1, title: 'Programadas', original: null, id: ''});
          }
          this.listTask.scheduleTasks.push({type: 2, title: '', original: task, id: task.id});
        } else {
          if (this.listTask.todayTasks.length === 0) {
            this.listTask.todayTasks.push({type: 1, title: 'Hoy', original: null, id: ''});
          }
          this.listTask.todayTasks.push({type: 2, title: '', original: task, id: task.id});
        }
      } else if (task.status === 2) {
        if (this.listTask.previousTasks.length === 0) {
          this.listTask.previousTasks.push({type: 1, title: 'Atrasadas', original: null, id: ''});
        }
        this.listTask.previousTasks.push({type: 2, title: '', original: task, id: task.id});
      } else if (task.status === 3 || task.status === 4) {
        if (this.listTask.historyTasks.length === 0) {
          this.listTask.historyTasks.push({type: 1, title: 'Historial', original: null, id: ''});
        }
        this.listTask.historyTasks.push({type: 2, title: '', original: task, id: task.id});
      }
    });
    this._firstGet = false;
  }

  public dateFilter(): void {
    if (this.station.stationTaskId && !this.notCalendar) {
      this._api.getStationTask(this.station.stationTaskId).subscribe((stationResponse: EntityResponse<StationTask>) => {
        if (stationResponse.code === HttpResponseCodes.OK) {
          this._creationDate = stationResponse.item.creationDate;
          const config: DateRangeOptions = {
            minDate: UtilitiesService.generateArrayDate(this._creationDate, false, true),
            maxDate: UtilitiesService.generateArrayDate(this._creationDate, true, true),
            startDate: this.start.timeStamp,
            endDate: this.end.timeStamp
          };
          this._dateService.open(config).afterClosed().subscribe(response => {
            if (response.code === 1) {
              this.today = (response.startDate === response.endDate);
              this.startDate = response.startDate;
              this.endDate = response.endDate;
              if (this.startDate.toLocaleDateString() === this.endDate.toLocaleDateString()) {
                this.today = true;
              }
              this._firstOpen = false;
              this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
              this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
              if (this.others) {
                this._tokenTwo = undefined;
                this.notCalendarTasks = [];
                this.getNotCalendarTask();
              } else {
                this._token = undefined;
                this.listTask = {historyTasks: [], previousTasks: [], todayTasks: [], scheduleTasks: []};
                this.getStationTask();
              }
            }
          });
        }
      });
    }
  }

  public taskFilter(): void {
    if (!this.notCalendar) {
      this._filterService.open(this.filter).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this.filter = response.filter;
          this.listTask = {historyTasks: [], previousTasks: [], todayTasks: [], scheduleTasks: []};
          this._token = undefined;
          if (this.filter === 0) {
            this.resetFilters();
          } else {
            this.getStationTask();
          }
        }
      });
    }
  }

  public resetFilters(getTasks?: boolean): void {
    this.filter = 0;
    this.startDate = new Date();
    this.endDate = new Date();
    this.start = UtilitiesService.createPersonalTimeStamp(this.startDate);
    this.end = UtilitiesService.createPersonalTimeStamp(this.endDate);
    this._firstOpen = true;
    this.today = true;
    this._taskType = '0';
    this._token = undefined;
    this._tokenTwo = undefined;
    if (!getTasks) {
      if (this.others) {
        this.notCalendarTasks = [];
        this.getNotCalendarTask();
      } else {
        this.listTask = {todayTasks: [], previousTasks: [], historyTasks: [], scheduleTasks: []};
        this.getStationTask();
      }
    }
  }

  public search(): void {
    if (!this.notCalendar) {
      this._taskFilterNameService.open({
        utils: this.utils.taskTemplates,
        lastTypeSelected: Number(this._taskType)
      }).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._taskType = response.data.toString();
          this.listTask = {historyTasks: [], previousTasks: [], todayTasks: [], scheduleTasks: []};
          this._token = undefined;
          this._tokenTwo = undefined;
          this.getStationTask();
        } else {
        }
      });
    }
  }

  public createStationTasks(): void {
    this._addStationService.open({stepActive: 3, stationId: this.station.id, disableClose: true});
  }

  public getNotCalendarTask(ev?: any): void {
    this.goBackList();
    let type = '1';
    if (ev) {
      this._tokenTwo = null;
      this.notCalendarTasks = [];
      this._lastTabSelected = ev.index;
      switch (ev.index) {
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
    } else {
      switch (this._lastTabSelected) {
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
      type: type || '1',
      cursor: this._tokenTwo
    };
    if (this.station.stationTaskId) {
      this._api.listUTask(this.filters).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          let token;
          if (this._tokenTwo === response.nextPageToken) {
            this._tokenTwo = null;
            token = true;
          } else {
            this._tokenTwo = response.nextPageToken;
          }
          if (response.items && !token) {
            this.compareNotCalendarTasks(response.items, Number(this.filters.type));
          } else if (!token) {
            this.notCalendarTasks = [];
          }
        } else {
          this.notCalendarTasks = [];
        }
      });
    }
  }

  private compareNotCalendarTasks(tasks: Task[], type: number): void {
    tasks.forEach(task => {
      this.notCalendarTasks.push({id: task.id, date: UtilitiesService.convertDate(task.date), type: type});
    });
    this._firstGet = false;
  }

  public goTaskInfo(task: any, type?: number): void {
    const today = UtilitiesService.createPersonalTimeStamp(new Date());
    if (!this.others) {
      if (task.status === 3 && this.user.role !== 7) {
        this._snackBarService.openSnackBar('No es posible visualizar tareas vencidas', 'OK', 3000);
        return;
      }
      if (task.date > today.timeStamp && this.user.role !== 7) {
        this._snackBarService.openSnackBar('No es posible visualizar tareas programadas', 'OK', 3000);
        return;
      }
      this._modalScroll.nativeElement.scrollTop = '0';
      this.reportConfig = {reportView: true, taskElement: task, typeReportView: task.original.typeReport, status: task.status};
    } else {
      this._modalScroll.nativeElement.scrollTop = '0';
      this.reportConfig = {reportView: true, taskElement: task, typeReportView: type, status: 4};
    }
  }

  public goBackList(): void {
    this._firstGet = true;
    this.reportConfig = {reportView: false, taskElement: null, typeReportView: 0, status: 0};
  }

  public closeOthers(): void {
    this.goBackList();
    this._lastTabSelected = 0;
    this.notCalendarTasks = [];
    this.others = false;
    if (!this.notCalendar) {
      this.resetFilters();
    }
  }

  public onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (!this.reportConfig.reportView && !this._firstGet && !this.load) {
        if (this.others) {
          if (this._tokenTwo) {
            this.getNotCalendarTask();
          }
        } else {
          if (this._token) {
            this.getStationTask();
          }
        }
      }
    }
  }

  public addNotCalendarTask(): void {
    let type: number;
    let type_two: number;
    switch (this._lastTabSelected) {
      case 0:
        type = 1;
        type_two = 7;
        break;
      case 1:
        type = 3;
        type_two = 9;
        break;
      case 2:
        type = 2;
        type_two = 6;
        break;
    }
    this.reportConfig = {
      reportView: true,
      status: 1,
      taskElement: {id: 0, status: 1, item: this.utils.uTaskTemplates[type - 1], hwg: false},
      typeReportView: type_two
    };
    this._modalScroll.nativeElement.scrollTop = '0';
  }

  public editFormat(): void {
    this._sharedService.setNotification({type: SharedTypeNotification.EditTask, value: this.reportConfig.typeReportView});
  }

  public exportFormat(): void {
    if (this.others) {
      this._api.exportReport(
        this.reportConfig.taskElement.id,
        this.reportConfig.typeReportView,
        this.reportConfig.taskElement.type).subscribe(response => {
        if (response) {
          this._openFile.open(response);
        }
      });
    } else {
      this._api.exportReport(
        this.reportConfig.taskElement.id,
        this.reportConfig.taskElement.original.typeReport,
        this.reportConfig.taskElement.original.type).subscribe(response => {
        if (response) {
          this._openFile.open(response);
        }
      });
    }
  }

  public exportListTasks(): void {
    if (this.listTask.scheduleTasks.length === 0 &&
      this.listTask.historyTasks.length === 0 &&
      this.listTask.previousTasks.length === 0 &&
      this.listTask.todayTasks.length === 0) {
      this._snackBarService.openSnackBar('No es posible exportar una lista vacía', 'OK', 3000);
      return;
    }
    this._api.exportCalendarByTaskList(this.filters, this.others).subscribe(response => {
      if (response) {
        this._openFile.open(response);
      }
    });
  }

  private createTasks(id: string): void {
    this._api.buildTaskByStation(id).subscribe(response => {
      switch (response.code) {
        case 200:
        case 400:
          if (response.item.status !== 3) {
            this.createTasks(id);
          } else {
            if (this.station) {
              this.station.stationTaskId = response.item.id;
              this.emptyLisTasks = false;
              this.finishCreateTasks = true;
            }
          }
          break;
        default:
          return;
      }
    });
  }
}
