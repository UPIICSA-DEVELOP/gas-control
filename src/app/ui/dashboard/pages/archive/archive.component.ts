import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {archiveAnimation} from '@app/ui/dashboard/pages/archive/archive.animation';
import {ApiService} from '@app/core/services/api/api.service';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {StationTask} from '@app/utils/interfaces/station-task';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {Station} from '@app/utils/interfaces/station';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  animations: [archiveAnimation]
})
export class ArchiveComponent implements OnInit {
  public stationId: string;
  public stationTasks: Array<StationTask>;
  public utils: AppUtil;
  public mode: 'list' | 'tasks';
  public station: Station;
  constructor(
    private _router: Router,
    private _api: ApiService,
    private _activatedRouter: ActivatedRoute
  ) {
    this.mode = 'list';
    this.stationTasks = [];
    this.stationId = null;
  }

  ngOnInit() {
    this.stationId = this._activatedRouter.snapshot.paramMap.get('stationId');
    if (this.stationId) {
      this.getStation();
      this.listStationTasks();
      this.getUtils();
    }
  }

  close() {
    this._router.navigate(['/home']).then();
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
    return `${newDate[0]}/${newDate[1]}/${newDate[2]}`;
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
