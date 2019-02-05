import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';

@Component({
  selector: 'app-list-collaborators',
  templateUrl: './list-collaborators.component.html',
  styleUrls: ['./list-collaborators.component.scss']
})
export class ListCollaboratorsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialog: MatDialogRef<ListCollaboratorsComponent>,
    private _api: ApiService
  ) { }

  ngOnInit() {
    this.getList(this._data.id);
  }

  private getList(id: any): void{
    this._api.listCollaborators(id, 'true').subscribe(response => {
      console.log(response);
    });
  }

  public close(): void{
    this._dialog.close();
  }

}
