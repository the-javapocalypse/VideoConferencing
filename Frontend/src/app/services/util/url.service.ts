import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UrlService {

    encode(url) {
        return url.replace(/\//g, '%2F').replace(/\+/g, '%2B');
    }

    decode(url) {
        return url.replace(/%2F/g, '/').replace(/%2B/g, '+');
    }

    constructor() {
    }
}
