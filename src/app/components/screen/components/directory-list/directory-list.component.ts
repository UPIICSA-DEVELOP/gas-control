/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements OnInit, OnChanges {
  @Input() public gasStation: any;
  public collaborators: any[];
  constructor(
    private _api:ApiService,
    private _snackBarService: SnackBarService,
    private _dialogService:DialogService
  ) { }

  ngOnInit() {
    this.collaborators = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.gasStation){
      this.getCollaborators();
    }
  }

  private getCollaborators():void{
    this._api.listCollaborators(this.gasStation.id, 'false').subscribe( response=>{
      switch (response.code) {
        case 200:
          this.collaborators = response.items;
          break;
        default:
          break;
      }
    });
  }

  public deleteCollaborator(id: string, index: number){
    this._dialogService.confirmDialog('¿Desea eliminar este registro?',
      '',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this._api.deletePerson(id).subscribe(response=>{
              switch (response.code) {
                case 200:
                  this.collaborators.splice(index, 1);
                  break;
                default:
                  break;
              }
            });
            break;
          default:
            break;
        }
    })
  }
}
