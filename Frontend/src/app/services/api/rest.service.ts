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

    constructor(private config: ConfigService,
                private http: HttpClient) {
        this.host = config.getHost();
        this.userEndPoint = config.getUserEndPoint();
    }

    // Create User
    createUser(body) {
        return this.http.post(this.host + this.userEndPoint + 'create', body, httpOptions);
    }
}
