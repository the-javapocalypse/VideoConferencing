import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private host = 'https://192.168.100.131:8080/'; // 'https://backend.syscon.io/' 'https://192.168.100.131:8080/'

    private userApi = '/user/';
    private roomApi = '/room/';
    private chimeApi = '/vc/';

    constructor() {
    }

    public getHost() {
        return this.host;
    }

    public getUserEndPoint() {
        return this.userApi;
    }
}
