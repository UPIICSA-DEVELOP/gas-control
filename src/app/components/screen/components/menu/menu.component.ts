/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {AuthService} from '@app/core/services/auth/auth.service';
import {NavBarComponent} from '@app/components/screen/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild('sidenav') menu: MatSidenav;
  @Output() menuObject: EventEmitter<any> = new EventEmitter<any>();
  public visibleMask: boolean;
  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _auth: AuthService,
    private _navBar: NavBarComponent
  ) { }

  ngOnInit() {
    this.menuObject.emit(this.menu);
  }

  public onOpenMenu(event: any): void{
    this.visibleMask = true;
  }

  public onCloseMenu(): void{
    this.visibleMask = false;
    this.menu.close().then();
  }

  private logOutButton(): void{
    this.onCloseMenu();
    this._navBar.logOut();
  }

}
