import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from '../storage/local-storage.service';

// const httpOptions = {
//     headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}),
//     observe: 'response' as 'body'
// };

@Injectable({
    providedIn: 'root'
})
export class RestService {

    // API config
    host = '';
    userEndPoint = '';
    roomEndPoint = '';

    // Headers
    httpOptions: any;
    httpOptionsAuth: any;

    // JWT
    token = '';

    constructor(private config: ConfigService,
                private http: HttpClient,
                private storage: LocalStorageService) {

        // Get Token
        this.token = storage.retrieveJWT().jwt;

        // Init API config
        this.host = config.getHost();
        this.userEndPoint = config.getUserEndPoint();
        this.roomEndPoint = config.getRoomEndPoint();

        // Init headers
        this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}),
            observe: 'response' as 'body'
        };
        this.httpOptionsAuth = {
            headers: new HttpHeaders(
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + this.token,
                    Accept: '*/*',
                }),
            observe: 'response' as 'body'
        };
    }

    // Create User
    createUser(body) {
        return this.http.post(this.host + this.userEndPoint + 'create', body, this.httpOptions);
    }

    // Login User
    loginUser(body) {
        return this.http.post(this.host + this.userEndPoint + 'login', body, this.httpOptions);
    }

    // Create Room
    createRoom(body) {
        return this.http.post(this.host + this.roomEndPoint + 'create', body, this.httpOptionsAuth);
    }
}
