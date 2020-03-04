const SimpleCrypto = require("simple-crypto-js").default;

var _secretKey = process.env.cryptoKey;
var simpleCrypto = new SimpleCrypto(_secretKey);

module.exports = {

    encrypt: function (pt) {
        return simpleCrypto.encrypt(pt);
    },

    decrypt: function (ct) {
        return simpleCrypto.decrypt(ct);
    }
}
