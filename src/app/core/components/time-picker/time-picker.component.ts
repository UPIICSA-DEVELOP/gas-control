import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input() value: string;
  @Input() disabled: boolean;
  @Output() valueChange: EventEmitter<string|null>;
  public theme: NgxMaterialTimepickerTheme;

  constructor() {
    this.valueChange = new EventEmitter<string|null>();
    this.theme = {
      dial: {
        dialBackgroundColor: '#0d47a1',
      },
      container: {
        bodyBackgroundColor: '#fff',
        buttonColor: '#000'
      },
      clockFace: {
        clockFaceBackgroundColor: '#fff',
        clockHandColor: '#0d47a1',
        clockFaceTimeInactiveColor: '#000'
      }
    };
  }

  ngOnInit() {
  }

  public selectDate(date: string): void{
    try {
      let hours = Number(date.match(/^(\d+)/)[1]);
      const minutes = Number(date.match(/:(\d+)/)[1]);
      const AMPM = date.match(/\s(.*)$/)[1];
      if(AMPM == "pm" && hours<12) hours = hours+12;
      if(AMPM == "am" && hours==12) hours = hours-12;
      let sHours = hours.toString();
      let sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
      this.valueChange.emit(this.value =  sHours + sMinutes);
    }catch(e){
      console.error(e);
      this.valueChange.emit(this.value =  null);
    }
  }

}
