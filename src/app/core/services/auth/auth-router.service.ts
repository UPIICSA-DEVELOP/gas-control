import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Constants} from 'app/utils/constants/constants.utils';
import {CookieService, LocalStorageService} from '@maplander/core';

@Injectable()
export class AuthRouterService implements CanActivate {

  constructor(
    private _router: Router
  ) {
  }

  private static validateUserInSession(): boolean {
    return CookieService.getCookie(Constants.IdSession) !== null;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url === '/login') {
      if (AuthRouterService.validateUserInSession()) {
        if (LocalStorageService.getItem(Constants.UserInSession).role === 7) {
          return this._router.createUrlTree(['/admin']);
        } else {
          return this._router.createUrlTree(['/home']);
        }
      } else {
        return true;
      }
    } else if (
      state.url.includes('/admin') &&
      AuthRouterService.validateUserInSession() &&
      LocalStorageService.getItem(Constants.UserInSession).role !== 7) {
      return this._router.createUrlTree(['/home']);
    } else {
      if (AuthRouterService.validateUserInSession()) {
        return true;
      } else {
        return this._router.createUrlTree(['/login']);
      }
    }
  }
}
