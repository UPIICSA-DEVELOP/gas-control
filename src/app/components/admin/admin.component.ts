import {Component, Inject, OnInit} from '@angular/core';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {DOCUMENT} from '@angular/common';
import {ListCollaboratorsService} from '@app/components/admin/components/list-collaborators/list-collaborators.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {AddConsultancyService} from '@app/components/admin/components/add-consultancy/add-consultancy.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public load: boolean;
  public consultancyList: any[];
  public consultancyListCopy: any[];
  public notResults: boolean;

  constructor(
    private _collaborators: ListCollaboratorsService,
    private _addConsultancy: AddConsultancyService,
    private _apiLoader: ApiLoaderService,
    private _auth: AuthService,
    private _dialog: DialogService,
    private _api: ApiService
  ) {
    this.consultancyList = [];
    this.consultancyListCopy = [];
  }

  ngOnInit() {
   this._apiLoader.getProgress().subscribe(load => this.load = load);
   this.getConsultancyList();
  }

  public getConsultancyList(): void{
    this._api.listConsultancy().subscribe(response => {
      switch (response.code){
        case 200:
          this.consultancyList = response.items;
          this.consultancyListCopy = this.consultancyList;
          break;
      }
    });
  }

  public openCollaborators(id: string, name: string): void{
   this._collaborators.open(id, name);
  }

  public addConsultancy(): void{
    this._addConsultancy.open().afterClosed().subscribe(response => {
      switch (response.code){
        case 200:
          this.getConsultancyList();
          break;
      }
    });
  }

  public signOut(): void{
    this._dialog.confirmDialog('Está a punto de cerrar sesión',
      '¿Desea continuar?',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe((response) => {
      switch (response.code) {
        case 1:
          this._auth.logOut();
          break;
      }
    });
  }


  public search(ev: any): void{
    const text = ev.srcElement.value.toLowerCase();
    if(text === ''){
      this.consultancyList = this.consultancyListCopy;
    }else{
      const listCopy = this.consultancyListCopy;
      const newResults = [];
      listCopy.forEach(item => {
        if(item.businessName.toLowerCase().includes(text) || item.address.toLowerCase().includes(text) || item.officePhone.toLowerCase().includes(text)){
          newResults.push(item)
        }
      });
      this.consultancyList = newResults;
      this.notResults = (newResults.length===0);
    }

  }

}
