import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ListCollaboratorsComponent} from '@app/components/admin/components/list-collaborators/list-collaborators.component';

@Injectable()
export class ListCollaboratorsService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public open(id: string, name: string): void{
    this._dialog.open(ListCollaboratorsComponent,
      {disableClose: true, panelClass: 'list-collaborators-panel', data: {id: id, name: name}});
  }
}
