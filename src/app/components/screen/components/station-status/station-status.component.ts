/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent implements OnInit{

  @Input() set station(stationObj: any){
    if(stationObj){
      this.createConfigGraphic(stationObj);
    }
  } ;
  @ViewChild('canvas') private _canvas: ElementRef;
  @ViewChild('legend') private _legend: ElementRef;
  public showGraphic: boolean;
  public data: any;
  public chart: any;
  private _chartConfig: any;
  constructor(
    @Inject(PLATFORM_ID) private _platformId
  ){
    this.showGraphic = isPlatformBrowser(this._platformId);
  }

  ngOnInit(): void {

  }

  private createConfigGraphic(station: any){
    this._chartConfig = {
      type: 'doughnut',
      data: {
        labels: ["Completas", "Incompletas"],
        datasets: [
          {
            data: [station.doneTasks, station.totalTasks-station.doneTasks],
            borderColor: '#FFFFFF',
            backgroundColor: ['#00C500','#707070'],
            fill: false
          }
        ]
      },
      options: {
        cutoutPercentage: 80,
        responsive: true,
        aspectRatio: 1,
        legend: false,
        legendCallback: function(chart) {
          const text: string[] = [];
          text.push('<ul style="font-size: 200%; line-height: 1.25; margin: 0;">');
          for(let y=0; y < chart.data.datasets[0].data.length; y++){
            text.push("<li style='color:"+chart.data.datasets[0].backgroundColor[y]+";'><span style='color: #707070; font-size: 50%'>" + chart.data.labels[y] +"</span></li>");
          }
          text.push('</ul>');
          return text.join("");
        }
      },
      plugins:{
        beforeDraw: (chart) => {
          let width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          let fontSize = (height / 80).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillStyle = '#0d47a1';

          let text = station.progress + '%',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    };

    this.createGraphic();
  }

  private createGraphic(): void{
    if(isPlatformBrowser(this._platformId)){
      if(this.chart){
        this.chart.render();
        this.chart.destroy();
        this.chart = null;
      }
      this.chart = new Chart(this._canvas.nativeElement, this._chartConfig);
      this._legend.nativeElement.innerHTML = this.chart.generateLegend();
    }
  }



}
