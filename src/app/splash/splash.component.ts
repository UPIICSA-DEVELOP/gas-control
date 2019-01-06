import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  private _seconds: number = 0;
  public visible: boolean;
  constructor(
    @Inject(PLATFORM_ID) private _platformId
  ) { }

  ngOnInit() {
    this.visible = true;
    if(isPlatformBrowser(this._platformId)){
      setInterval(() => {
        this.increaseNumber();
      }, 1000);
    }
  }

  private increaseNumber(): void{
    this._seconds += 1;
    if(this._seconds===3){
      this.visible = false;
    }
  }
}
