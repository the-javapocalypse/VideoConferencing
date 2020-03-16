import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from '../storage/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(private storage: LocalStorageService,
                private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.storage.isLoggedIn()) {
            return true;
        }

        // navigate to login page
        this.router.navigate(['/account']);
        // you can save redirect url so after authing we can move them back to the page they requested
        return false;
    }

}
