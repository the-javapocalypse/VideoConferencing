import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}),
    observe: 'response' as 'body'
};

@Injectable({
    providedIn: 'root'
})
export class RestService {

    host = '';
    userEndPoint = '';
    roomEndPoint = '';

    constructor(private config: ConfigService,
                private http: HttpClient) {
        this.host = config.getHost();
        this.userEndPoint = config.getUserEndPoint();
        this.userEndPoint = config.getRoomEndPoint();
    }

    // Create User
    createUser(body) {
        return this.http.post(this.host + this.userEndPoint + 'create', body, httpOptions);
    }

    // Login User
    loginUser(body) {
        return this.http.post(this.host + this.userEndPoint + 'login', body, httpOptions);
    }

    // Create Room
    createRoom(body) {
        return this.http.post(this.host + this.roomEndPoint + 'create', body, httpOptions);
    }
}