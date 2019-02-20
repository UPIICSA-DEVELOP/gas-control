/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {TimePickerService} from '@app/core/components/time-picker/time-picker.service';
import {IDialogResult} from 'amazing-time-picker/src/app/atp-library/definitions';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Directive({
  selector: '[appDisableWrite]',
  host: {
    '(input)':'input()',
    '(focus)':'focus()',
    '(click)':'click()'
  }
})
export class DisableWriteDirective {

  @Output() time: EventEmitter<string|null>;
  @Output() timeFormat: EventEmitter<string|null>;

  private _dialog: IDialogResult;

  constructor(
    private _timePickerService: TimePickerService,
    private _el: ElementRef
  ) {
    this.time = new EventEmitter<string|null>();
    this.timeFormat = new EventEmitter<string|null>();
    this._el.nativeElement.setAttribute('autocomplete', 'off');
  }

  input(): void{
   this.setText(this._el.nativeElement.value);
    if(!this._dialog){
      this.open();
    }
  }

  focus(): void{
    this.setText(this._el.nativeElement.value);
    this.open();
  }

  click(): void{
    this.setText(this._el.nativeElement.value);
    this.open();
  }

  private open(): void{
    this._dialog = this._timePickerService.open();
    this._dialog.afterClose().subscribe((time: string) => {
      this.time.emit(time.replace(':',''));
      this.timeFormat.emit(UtilitiesService.createTimeString(time));
    });
  }

  private setText(text: string): void{
    if(text.length === 10){
      this._el.nativeElement.value = text;
    }
  }

}
