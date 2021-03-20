const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Koa = require('koa');
const app = new Koa();
const port = 8080;
const ftx = require('./lib');
const CronJob = require('cron').CronJob;

new CronJob('0 12 * * * *', () => {
    ftx.updateLendableSetting();
}, null, true);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});