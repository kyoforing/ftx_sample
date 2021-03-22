const { getLendableMoney, updateLendableMoney } = require('./ftx-request');

exports.handler = async () => {
    const currencies = process.env.CURRENCY || '';
    const minRate = '0.00000571';
    const lendingInfo = await getLendableMoney();

    for (let currency of currencies.split(',')) {
        const specifiedCurrency = lendingInfo.result.filter(el => el.coin === currency);

        if (specifiedCurrency.length > 0) {
            await updateLendableMoney(currency, minRate, Math.floor(specifiedCurrency[0].lendable * 1000000) / 1000000);
        } 
    }
}
