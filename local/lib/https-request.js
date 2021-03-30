const crypto = require("crypto");
const https = require("https");
const hostname = "ftx.com";

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
                  resp += data.toString();
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

module.exports = FtxApiRequest;