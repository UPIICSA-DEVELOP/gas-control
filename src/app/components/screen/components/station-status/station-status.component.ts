/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent {
  public showGraphic: boolean;
  public doughnutChartData: number[] = [90, 30];
  public doughnutChartLabels: string[] = ['Completas', 'Pendientes'];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartColor: any[] = [{backgroundColor: ["#05C000", "#707070"]}];
  public doughnutChartOptions: any = {
    cutoutPercentage: 75,
    tooltips: {
      enable: false
    },
    legend: {
      display: true,
      position: 'bottom',
      fullWidth: false,
      labels: {
        fontColor: '#707070',
        fontFamily: 'Roboto, "Helvetice New", "Arial", sans-serif'
      }
    },
    responsive: true,
    devicePixelRatio: 0,
    aspectRatio: 1
  };

  constructor(
    @Inject(PLATFORM_ID) private _platformId
  ){
    this.showGraphic = isPlatformBrowser(this._platformId);
  }

  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }
}
