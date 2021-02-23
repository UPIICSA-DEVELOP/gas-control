import { Component, OnInit } from '@angular/core';
import {StationTask} from '@app/utils/interfaces/station-task';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {Station} from '@app/utils/interfaces/station';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';

@Component({
  selector: 'app-archive-tasks',
  templateUrl: './archive-tasks.component.html',
  styleUrls: ['./archive-tasks.component.scss']
})
export class ArchiveTasksComponent implements OnInit {
  public stationId: string;
  public stationTasks: Array<StationTask>;
  public utils: AppUtil;
  public mode: 'list' | 'tasks';
  public station: Station;
  public hideClose: boolean;
  constructor(
    private _api: ApiService,
    private _activatedRouter: ActivatedRoute,
    private _shared: SharedService
  ) {
    this.mode = 'list';
    this.stationTasks = [];
    this.stationId = null;
    this.hideClose = false;
  }

  ngOnInit() {
    this.stationId = this._activatedRouter.snapshot.paramMap.get('stationId');
    if (this.stationId) {
      this.getStation();
      this.listStationTasks();
      this.getUtils();
    }
  }

  changeOthers(): void {
    this._shared.setNotification({type: SharedTypeNotification.NotCalendarArchive, value: true});
  }

  goToTasks(stationTaskId: string): void {
    this.station.stationTaskId = stationTaskId;
    this.mode = 'tasks';
  }

  returnToList(): void {
    this.station.stationTaskId = null;
    this.mode = 'list';
  }

  formatDate(date: number): string {
    const newDate = UtilitiesService.convertDate(date);
    return `${newDate[0]}/${newDate[1].toUpperCase()}/${newDate[2]}`;
  }

  private getStation(): void {
    this._api.getStation(this.stationId).subscribe((response) => {
      switch (response.code) {
        case HttpResponseCodes.OK:
          this.station = response.item;
          break;
      }
    });
  }

  private listStationTasks(): void {
    this._api.listStationTaskByStation(this.stationId).subscribe((response) => {
      if (response.items) {
        this.stationTasks = this.stationTasks.concat(response.items || []);
      }
    });
  }

  private getUtils(): void {
    this._api.getUtils().subscribe((response) => {
      switch (response.code) {
        case HttpResponseCodes.OK:
          this.utils = response.item;
          break;
      }
    });
  }
}

