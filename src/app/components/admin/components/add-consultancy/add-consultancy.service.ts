import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {AddConsultancyComponent} from '@app/components/admin/components/add-consultancy/add-consultancy.component';

@Injectable()
export class AddConsultancyService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(): void{
    this._dialog.open(AddConsultancyComponent, {panelClass: 'add-consultancy-panel'});
  }
}
