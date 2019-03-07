/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.40s ease-out', style({ right: '0'  }))
      ]),
      transition(':leave', [
        style({ right: '0'}),
        animate('.40s ease-in', style({ right: '-100%' }))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class NotificationsComponent implements OnInit{
  public notifications: any[];
  private _station: string;
  private _idLegal: string;
  public isAdmin: boolean;
  constructor(
    private _route: Router,
    private _activateRouter: ActivatedRoute,
    private _api: ApiService,
    private _dialogService: DialogService
  ) {
    this.isAdmin = false;
    this.notifications = [];
  }

  ngOnInit() {
    if(this._activateRouter.snapshot.queryParams.admin) {
      this._idLegal = this._activateRouter.snapshot.queryParams.admin;
      this.isAdmin = true;
    }
    if (this._activateRouter.snapshot.queryParams.id) {
      this._station = this._activateRouter.snapshot.queryParams.id;
      this.getNotifications();
    }
  }

  private getNotifications():void{
    let personId;
    if(!this._idLegal){personId = CookieService.getCookie(Constants.IdSession);}else{personId = this._idLegal;}
    this._api.listNotifications(personId, this._station).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.notifications = response.items;
            for(let i = 0; i<this.notifications.length;i++){
              this.notifications[i].date = UtilitiesService.convertDate(this.notifications[i].date)
            }
            console.log(this.notifications);
          }else{
            this.notifications = [];
          }
          break;
        default:
          this.notifications = [];
          break;
      }
    })
  }

  public deleteNotification(id: string, index: number):void{
    this._dialogService.confirmDialog(
      '¿Desea eliminar esta notificación?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response=>{
      switch (response.code){
        case 1:
          this._api.deleteNotification(id).subscribe(response=>{
            switch (response.code){
              case 200:
                this.notifications.splice(index, 1);
                break;
            }
          });
          break;
      }
    });
  }

  public onCloseNotifications(): void {
    this._route.navigate(['/home']).then();
  }

}
