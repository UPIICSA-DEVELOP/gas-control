import {Component, Inject, OnInit} from '@angular/core';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {DOCUMENT} from '@angular/common';
import {ListCollaboratorsService} from '@app/components/admin/components/list-collaborators/list-collaborators.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public load: boolean;
  public consultancyList: any[];

  constructor(
    private _collaborators: ListCollaboratorsService,
    private _apiLoader: ApiLoaderService,
    private _api: ApiService
  ) {
    this.consultancyList = [];
  }

  ngOnInit() {
   this._apiLoader.getProgress().subscribe(load => this.load = load);
   this.getConsultancyList();
  }

  public getConsultancyList(): void{
    this._api.listConsultancy().subscribe(response => {
      switch (response.code){
        case 200:
          console.log(response.items);
          this.consultancyList = response.items;
          break;
      }
    });
  }

  public openCollaborators(id: string): void{
   this._collaborators.open(id);
  }

}
