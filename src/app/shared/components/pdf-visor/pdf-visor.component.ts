import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UtilitiesService} from 'app/utils/utilities/utilities';

@Component({
  selector: 'app-pdf-visor',
  templateUrl: './pdf-visor.component.html',
  styleUrls: ['./pdf-visor.component.scss']
})
export class PdfVisorComponent implements OnInit {


  public pdfSrc: any;
  public hideDownload: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<PdfVisorComponent>
  ) { }

  ngOnInit() {
    this.pdfSrc = this._data.url;
    this.hideDownload = this._data.hideDownload || false;
  }

  public downloadFile(): void{
    UtilitiesService.downloadFileByBlob(this.pdfSrc, 'document.pdf')
  }

  public close(): void{
    this._dialogRef.close();
  }

}
