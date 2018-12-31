import { Injectable } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog/typings/dialog-ref';
import {MatDialog} from '@angular/material';
import {LocationComponent} from '@app/core/components/location/location.component'

export interface LocationOptions {
  lat: number;
  lng: number
}

@Injectable()
export class LocationService {

  constructor(
    private _matDialog: MatDialog
  ) {
  }

  public open(options?: LocationOptions): MatDialogRef<LocationComponent>{
    return this._matDialog.open(LocationComponent, {panelClass: 'location-panel', data: options || null});
  }
}
