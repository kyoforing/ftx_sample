const crypto = require("crypto");
const https = require("https");
const hostname = "ftx.com";

exports.index = async () => {
    const currency = 'USD';
    const minRate = '0.00000571';
    const lendableMoney = await getLendableMoney(currency);
    await updateLendableMoney(currency, minRate, lendableMoney);
};

const getLendableMoney = async (currency) => {
    let result = 0;
    const FtxRequest = new FtxApiRequest();
    
    FtxRequest.method = 'GET';
    FtxRequest.endpoint = '/api/spot_margin/lending_info';
    const lendingInfo = await FtxRequest.sendRequest();

    if (lendingInfo.result && lendingInfo.result.length > 0) {
        const specifiedCurrency = lendingInfo.result.filter(el => el.coin === currency);

        if (specifiedCurrency.length > 0) {
            result = Math.floor(specifiedCurrency[0].lendable * 1000000) / 1000000;
        }
    }

    return result;
}

const updateLendableMoney = async (currency, minRate, lendableMoney) => {
    const FtxRequest = new FtxApiRequest();
    
    FtxRequest.method = 'POST';
    FtxRequest.endpoint = '/api/spot_margin/offers';
    FtxRequest.payload = JSON.stringify({
        'coin': currency,
        'size': lendableMoney,
        'rate': minRate,
    });
    const result = await FtxRequest.sendRequest();
    if (result.success) {
        console.log(`Update lendable money to ${lendableMoney}`);
    } else {
        console.log(`Update lendable money failed`);
    };
}

class FtxApiRequest {
    constructor() {
        this._nonce = Date.now();
    }

    set method(method) {
        this._method = method;
    }

    set endpoint(endpoint) {
        this._endpoint = endpoint;
    }

    set payload(payload) {
        this._payload = payload;
    }

    get digestHex() {
        const hmac = crypto.createHmac("sha256", process.env.FTX_API_SECRET);
        const signature = `${this._nonce}${this._method}${this._endpoint}${this._payload || ''}`;

        return hmac.update(signature).digest("hex");
    }

    async sendRequest() {
        return new Promise((resolve, reject) => {
            const options = {
                host: hostname,
                port: 443,
                path: this._endpoint,
                method: this._method,
                headers: {
                  "FTX-KEY": process.env.FTX_API_KEY,
                  "FTX-SIGN": this.digestHex,
                  "FTX-TS": this._nonce,
                }
            };

            if (this._method === 'POST') {
                options.headers['Content-Type'] = 'application/json';
                options.headers['Content-Length'] = this._payload.length;
            }
              
            const req = https.request(options, res => {
                let resp = '';

                res.on("data", data => {
                  resp = data.toString();
                });
                res.on('end', () => {
                    console.log(resp);
                    resolve(JSON.parse(resp));
                });
                req.on('error', (err) => {
                    reject(err);
                });
            });
              
            if (this._method === 'POST') {
                req.write(this._payload);
            }
            req.end();         
        });
    }
}