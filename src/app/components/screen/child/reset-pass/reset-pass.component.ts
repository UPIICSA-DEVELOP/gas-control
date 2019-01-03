/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Constants} from '@app/core/constants.core';
import {ApiService} from '@app/core/services/api/api.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit, AfterViewInit {

  constructor(
    private _dialogService: DialogService,
    private _api: ApiService,
    private _snackBarService: SnackBarService,
    private _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (this._router.url === '/home/updatepassword') {
      this._dialogService.alertWithDoubleInput(
        'Actualice su contraseña',
        '',
        'Nueva contraseña',
        'Confirmar nueva contraseña',
        'ACEPTAR',
        '',
        '').afterClosed().subscribe(response => {
        const newPassword = response.data.password;
        switch (response.code) {
          case 1:
            this._snackBarService.openSnackBar('Espere un momento', '', 0);
            const id = CookieService.getCookie(Constants.IdSession);
            this._api.getPerson(id).subscribe(response => {
              switch (response.code) {
                case 200:
                  let person = response.item;
                  person.password = newPassword;
                  this._api.updatePerson(person).subscribe(response => {
                    switch (response.code) {
                      case 200:
                        this._auth.logIn(response.item, false, null);
                        LocalStorageService.removeItem(Constants.UpdatePassword);
                        this._snackBarService.closeSnackBar();
                        this._snackBarService.openSnackBar('Contraseña actualizda', 'OK', 3000);
                        break;
                      default:
                        this._snackBarService.openSnackBar('No se a podido actualizar la contraseña', 'OK', 3000);
                        break;
                    }
                  });
                  break;
              }
            });
            break;
        }
      });
    }
  }
}
