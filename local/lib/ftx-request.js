const FtxApiRequest = require('./https-request');

const getLendableMoney = async () => {
    const FtxRequest = new FtxApiRequest();
    
    FtxRequest.method = 'GET';
    FtxRequest.endpoint = '/api/spot_margin/lending_info';
    return await FtxRequest.sendRequest();
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
        console.log(`Update lendable money to ${lendableMoney} ${currency}`);
    } else {
        console.log(`Update lendable money failed`);
    };
}

module.exports = {
    getLendableMoney,
    updateLendableMoney,
}