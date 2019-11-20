import {Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit {
  private _seconds = 0;
  public visible: boolean;

  constructor(
    @Inject(PLATFORM_ID) private _platformId
  ) {
  }

  ngOnInit() {
    this.visible = true;
    if (isPlatformBrowser(this._platformId)) {
      setInterval(() => {
        this.increaseNumber();
      }, 1000);
    }
  }

  private increaseNumber(): void {
    this._seconds += 1;
    if (this._seconds === 2) {
      this.visible = false;
    }
  }
}
