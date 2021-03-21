const FtxApiRequest = require('./https-request');

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

module.exports = {
    getLendableMoney,
    updateLendableMoney,
}