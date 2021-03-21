const { getLendableMoney, updateLendableMoney } = require('./ftx-request');

exports.handler = async () => {
    const currency = 'USD';
    const minRate = '0.00000571';
    const lendableMoney = await getLendableMoney(currency);
    await updateLendableMoney(currency, minRate, lendableMoney);
}
