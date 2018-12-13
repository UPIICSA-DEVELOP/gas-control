/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component} from '@angular/core';


@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent {
  public doughnutChartLabels: string[] = ['Completas', 'Pendientes'];
  public doughnutChartData: number[] = [75, 25];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartOptions: any = {
    backgroundColor: [
      '#257602',
      '#707070'
    ],
    cutoutPercentage: 80,
    legend: {
      display: false
    },
    responsive: true,
    devicePixelRatio: 0,
    aspectRatio: 1
  };

  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
}
