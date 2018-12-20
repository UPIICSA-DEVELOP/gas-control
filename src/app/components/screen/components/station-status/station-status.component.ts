/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent implements OnInit, AfterViewInit{
  @ViewChild('canvas') private _canvas: ElementRef;
  public showGraphic: boolean;
  public chart: any;
  public chartConfig: any ={
    type: 'doughnut',
    data: {
      labels: ["Completas", "Incompletas"],
      datasets: [
        {
          data: [90, 30],
          borderColor: '#FFFFFF',
          backgroundColor: ['#00C500','#707070'],
          fill: false
        }
      ]
    },
    options: {
      cutoutPercentage: 75,
      responsive: true,
      aspectRatio: 1,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#707070',
          fontFamily: 'Roboto, "Helvetice New", "Arial", sans-serif'
        }
      },
      centerText: {
        display: true,
        text: "280"
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }],
      }
    }
  };
  constructor(
    @Inject(PLATFORM_ID) private _platformId
  ){
    if(isPlatformBrowser(this._platformId)){
      this.showGraphic = true;
    }
    this.showGraphic = isPlatformBrowser(this._platformId);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this._platformId)){
      this.chart = new Chart(this._canvas.nativeElement, this.chartConfig);
      Chart.pluginService.register({
        beforeDraw: function(chart: any) {
          let width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          let fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.fontColor = '#0d47a1';

          let text = ((90*100)/120).toFixed(0)+"%",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2.85;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      });
    }
  }



}
