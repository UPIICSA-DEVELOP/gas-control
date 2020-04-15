import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Constants} from 'app/utils/constants/constants.utils';
import {LocalStorageService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {AuthService} from '@app/core/services/auth/auth.service';

@Injectable()
export class AuthRouterService implements CanActivate {

  constructor(
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url === '/login') {
      if (AuthService.validateUserInSession()) {
        if (LocalStorageService.getItem<Person>(Constants.UserInSession).role === 7) {
          return this._router.createUrlTree(['/admin']);
        } else {
          return this._router.createUrlTree(['/home']);
        }
      } else {
        return true;
      }
    } else if (
      state.url.includes('/admin') &&
      AuthService.validateUserInSession() &&
      LocalStorageService.getItem<Person>(Constants.UserInSession).role !== 7) {
      return this._router.createUrlTree(['/home']);
    } else {
      if (AuthService.validateUserInSession()) {
        return true;
      } else {
        return this._router.createUrlTree(['/login']);
      }
    }
  }
}
