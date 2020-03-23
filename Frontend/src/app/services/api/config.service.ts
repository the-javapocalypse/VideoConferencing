import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private host = '';

    private userApi = 'user/';
    private roomApi = 'room/';
    private chimeApi = 'vc/';
    private covidApi = 'covid/';

    constructor() {
        this.host = environment.server;
    }

    public getHost() {
        return this.host;
    }

    public getUserEndPoint() {
        return this.userApi;
    }

    public getRoomEndPoint() {
        return this.roomApi;
    }

    public getCovidEndPoint() {
        return this.covidApi;
    }
}
