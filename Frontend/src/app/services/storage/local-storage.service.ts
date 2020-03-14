import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    private videoConferenceRoasterInformation: 'vc_roaster_info';
    private userJWTToken: 'user_JWT_syscon';

    public storeJWT(jwt: object, userInfo: object) {
        localStorage.setItem(this.userJWTToken, JSON.stringify({
            jwt,
            userInfo
        }));
    }

    public retrieveJWT() {
        const data = JSON.parse(localStorage.getItem(this.userJWTToken));
        if (!data) {
            return null;
        }
        return data;
    }

    public isLoggedIn() {
        const storedToken = localStorage.getItem(this.userJWTToken);
        if (!storedToken) {
            return false;
        }
        return true;
    }


    public logout() {
        localStorage.removeItem(this.userJWTToken);
    }


    public setRoasterInfo(info: object) {
        console.log('storing roaster info');
        localStorage.setItem(this.videoConferenceRoasterInformation, JSON.stringify({
            roasterInfo: info
        }));
    }

    public getRoasterInfo() {
        let data = JSON.parse(localStorage.getItem(this.videoConferenceRoasterInformation));
        if (!data) return null;
        return data.roasterInfo;
    }


    public roasterInfoIsSet() {
        console.log('checking roaster info');
        let data = JSON.parse(localStorage.getItem(this.videoConferenceRoasterInformation));
        if (data === null) return false;
        if (!data.roasterInfo) return false;
        return true;
    }

}
