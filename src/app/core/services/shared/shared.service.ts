import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Subject} from 'rxjs/internal/Subject';

export interface SharedNotification {
  value: any;
  type: SharedTypeNotification;
}

export enum SharedTypeNotification {
  Directory,
  NotCalendarTask,
  CreationTask,
  ChangeStation,
  EditTask,
  HwgActive,
  FinishEditTask,
  OpenCloseMenu,
  UpdateStation
}

@Injectable()
export class SharedService {

  private _notifier: Subject<SharedNotification>;

  constructor() {
    this._notifier = new Subject<SharedNotification>();
  }

  public setNotification(notification: SharedNotification): void {
    this._notifier.next(notification);
  }

  public getNotifications(): Observable<any> {
    return this._notifier.asObservable();
  }

}
