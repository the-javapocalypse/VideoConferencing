import {Injectable} from '@angular/core';

import {SimpleCrypto} from 'simple-crypto-js';


@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    secretKey = 'ch!m3sy$cOn@!@';
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
