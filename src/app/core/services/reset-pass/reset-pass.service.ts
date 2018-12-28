/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService implements Resolve<any>{

  constructor(
    private _api: ApiService,
    private _route:Router,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const id = route.queryParams['link'];
    this._api.signInWithLink(id).subscribe(response =>{
      switch (response.code) {
        case 200:
          SessionStorageService.setItem(Constants.UserInSession, response.item);
          this._auth.logIn(response.item, false);
          this._route.navigate(['/home']).then();
          this._dialogService.alertWithDoubleInput(
            'Actualice su contraseña',
            '',
            'Nueva contraseña',
            'Confirmar nueva contraseña',
            'Aceptar',
            '',
            '').afterClosed().subscribe(response=>{
              const newPassword = response.data.password;
              switch (response.code) {
                case 1:
                  this._snackBarService.openSnackBar('Espere un momento', '', 0);
                  this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
                    switch (response.code) {
                      case 200:
                        SessionStorageService.setItem(Constants.UserInSession, {profileImage: (response.item.profileImage)?response.item.profileImage.thumbnail:null});
                        const person = response.item;
                        person.password = newPassword;
                        this._api.updatePerson(person).subscribe(response =>{
                          switch (response.code) {
                            case 200:
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
          break;
        default:
          this._route.navigate(['/']).then();
          break;
      }
    })
  }

}
