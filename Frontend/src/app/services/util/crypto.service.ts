import {Injectable} from '@angular/core';

import {SimpleCrypto} from 'simple-crypto-js';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    secretKey = environment.cryptoKey;
    simpleCrypto: any;

    constructor() {
        this.simpleCrypto = new SimpleCrypto(this.secretKey);
    }

    encrypt(pt) {
        return this.simpleCrypto.encrypt(pt);
    }

    decrypt(ct) {
        return this.simpleCrypto.decrypt(ct);
    }

}
