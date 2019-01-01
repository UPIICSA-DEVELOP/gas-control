/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-collaborators-list',
  templateUrl: './collaborators-list.component.html',
  styleUrls: ['./collaborators-list.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({right: '-100%'}),
        animate('.40s ease-out', style({right: '0'}))
      ]),
      transition(':leave', [
        style({right: '0'}),
        animate('.40s ease-in', style({right: '-100%'}))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class CollaboratorsListComponent implements OnInit {

  constructor(
    private _route: Router
  ) { }

  ngOnInit() {
  }

  public onCloseCollaborators(): void{
    this._route.navigate(['/home']);
  }

}
