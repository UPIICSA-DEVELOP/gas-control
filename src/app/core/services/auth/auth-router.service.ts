import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@app/core/services/auth/auth.service';

@Injectable()
export class AuthRouterService implements CanActivate {

  constructor(
    private _router: Router
  ) {
  }

  private static validateAdmin(): boolean {
    const user = AuthService.getInfoUser() || null;
    if (!user) {
      return false;
    }
    return user.role === 7;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    switch (state.url) {
      case '/login':
        if (AuthService.validateUserInSession()) {
          if (AuthRouterService.validateAdmin()) {
            return this.navigateToAdmin();
          }
          return this.navigateToHome();
        } else {
          return true;
        }
      case  '/home':
        if (AuthService.validateUserInSession()) {
          return true;
        } else {
          return this.navigateToLogin();
        }
      case '/admin':
        if (AuthRouterService.validateAdmin()) {
          return true;
        } else {
          return this.navigateToLogin();
        }
      default:
        return this.navigateToLogin();
    }
  }

  private navigateToHome(): UrlTree {
    return this._router.createUrlTree(['/home']);
  }

  private navigateToAdmin(): UrlTree {
    return this._router.createUrlTree(['/admin']);
  }

  private navigateToLogin(): UrlTree {
    return this._router.createUrlTree(['/login']);
  }
}
