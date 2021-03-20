## Run cron job per hour in local
1. Update your FTX key pair in local/.env
2. Run below script
```
cd local
npm install
node app.js
```

## Run cron job in GCP
1. Follow below webpage to create Cloud function and cloud Scheduler job
https://cloud.google.com/scheduler/docs/tut-pub-sub
2. Copy GCP/index.js to Cloud Function
3. Set yout FTX key pair to runtime environment variables of your Cloud function (FTX_API_KEY & FTX_API_SECRET)
