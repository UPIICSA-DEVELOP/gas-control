import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-visor',
  templateUrl: './pdf-visor.component.html',
  styleUrls: ['./pdf-visor.component.scss']
})
export class PdfVisorComponent implements OnInit {

  public url: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dom: DomSanitizer,
    private _dialogRef: MatDialogRef<PdfVisorComponent>
  ) { }

  ngOnInit() {
    this.url = this._dom.bypassSecurityTrustResourceUrl(this._data);
  }

}
