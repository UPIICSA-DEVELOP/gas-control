import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CountryCodeComponent} from 'app/shared/components/country-code/country-code.component';

@Injectable()
export class CountryCodeService {

  constructor(
    private _dialog: MatDialog
  ) {
  }

  public openDialog(): MatDialogRef<CountryCodeComponent> {
    return this._dialog.open(CountryCodeComponent, {panelClass: 'country-code-panel', disableClose: true});
  }
}
