/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {Constants} from 'app/utils/constants/constants.utils';
import {Task} from '@app/utils/interfaces/task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  public task: Task;
  public typeCard: number;

  @Input() set taskInfo(info: any) {
    if (info) {
      this.task = info.original;
    }
  }

  @Input() set implementation(type: number) {
    if (type) {
      this.changeCardInView(type);
    }
  }

  public zones: string[];
  public priority: string[];
  public frequency: string[];
  public disabledRipple: boolean;

  constructor() {
    this.zones = Constants.Zones;
    this.priority = Constants.Level;
    this.frequency = Constants.Frequency;
    this.typeCard = 1;
    this.disabledRipple = true;
  }

  ngOnInit() {
  }

  private changeCardInView(type: number): void {
    this.disabledRipple = (type !== 1);
    switch (type) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.typeCard = type;
        break;
      default:
        this.typeCard = 1;
        break;
    }
  }

}
