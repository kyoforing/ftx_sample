## Run cron job in local
1. Update your FTX key pair in local/.env
2. Run below script
```
cd local
npm install
node app.js
```
## Run cron job in AWS
1. Create lambda function
2. Copy all file in AWS folder to lambda function
3. Set yout FTX key pair to environment variables (FTX_API_KEY & FTX_API_SECRET)
4. test and deploy lambda function
5. Create job to execute lambda function by EventBridge

## Run cron job in GCP
1. Follow below webpage to create Cloud function and cloud Scheduler job
https://cloud.google.com/scheduler/docs/tut-pub-sub
2. Copy GCP/index.js to Cloud Function
3. Set yout FTX key pair to runtime environment variables of Cloud function (FTX_API_KEY & FTX_API_SECRET)
