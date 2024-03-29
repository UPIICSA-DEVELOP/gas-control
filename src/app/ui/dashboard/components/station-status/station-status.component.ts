/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {
  AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs';
import {Station} from '@app/utils/interfaces/station';
const chartJs = require('chart.js');


@Component({
  selector: 'app-station-status',
  templateUrl: './station-status.component.html',
  styleUrls: ['./station-status.component.scss']
})
export class StationStatusComponent implements OnInit, AfterViewInit, OnDestroy {
  private _station: Station;
  @Input() set station(stationObj: Station) {
    if (stationObj) {
      this._station = stationObj;
      if (this._canvas) {
        this.updateData();
      }
    }
  }

  @ViewChild('canvas', {static: false}) private _canvas: ElementRef;
  @ViewChild('legend', {static: true}) private _legend: ElementRef;
  public showGraphic: boolean;
  public data: any;
  public chart: any;
  private _chartConfig: any;
  private _subscriptionShared: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _sharedService: SharedService
  ) {
    this.showGraphic = isPlatformBrowser(this._platformId);
  }

  ngOnInit(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.FinishEditTask) {
        this._station.doneTasks = response.value.doneTasks;
        this._station.progress = response.value.progress;
        this.updateData();
      }
      if (response.type === SharedTypeNotification.DeleteTask) {
        this._station.doneTasks = response.value.done;
        this._station.totalTasks = response.value.total;
        this._station.progress = response.value.progress;
        this.updateData();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this._station) {
      this.createConfigGraphic();
    }
  }

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
  }

  private createConfigGraphic() {
    this._chartConfig = {
      type: 'doughnut',
      data: {
        labels: ['Completas', 'Incompletas'],
        datasets: [
          {
            data: [this._station.doneTasks, this._station.totalTasks - this._station.doneTasks],
            borderColor: '#FFFFFF',
            backgroundColor: ['#00C500', '#707070'],
            fill: false
          }
        ]
      },
      options: {
        cutoutPercentage: 80,
        responsive: true,
        aspectRatio: 1,
        legend: false,
        legendCallback: function (chart) {
          const text: string[] = [];
          text.push('<ul style="font-size: 200%; line-height: 1.25; margin: 0;">');
          for (let y = 0; y < chart.data.datasets[0].data.length; y++) {
            text.push('<li style=\'color:' + chart.data.datasets[0].backgroundColor[y] + ';\'><span style=\'color: #707070; font-size: 50%\'>' + chart.data.labels[y] + '</span></li>');
          }
          text.push('</ul>');
          return text.join('');
        }
      },
      plugins: {
        beforeDraw: (chart) => {
          const width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          const fontSize = (height / 80).toFixed(2);
          ctx.font = fontSize + 'em sans-serif';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#0d47a1';

          const text = this._station.progress + '%',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    };

    this.createGraphic();
  }

  private updateData(): void {
    this.chart.data.datasets = [
      {
        data: [this._station.doneTasks, this._station.totalTasks - this._station.doneTasks],
        borderColor: '#FFFFFF',
        backgroundColor: ['#00C500', '#707070'],
        fill: false
      }
    ];
    this.chart.update();
  }

  private createGraphic(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.chart = new chartJs.Chart(this._canvas.nativeElement, this._chartConfig);
      this._legend.nativeElement.innerHTML = this.chart.generateLegend();
    }
  }


}
