import {Injectable} from '@angular/core';

import {SimpleCrypto} from 'simple-crypto-js';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    secretKey = '';
    simpleCrypto: any;

    constructor() {
        this.simpleCrypto = new SimpleCrypto(this.secretKey);
        this.secretKey = environment.cryptoKey;
    }

    encrypt(pt) {
        return this.simpleCrypto.encrypt(pt);
    }

    decrypt(ct) {
        return this.simpleCrypto.decrypt(ct);
    }

}
