## Run cron job in local
1. Update your FTX key pair and currency you want in local/.env
2. Run below script
```
cd local
npm install
node app.js
```
## Run cron job in AWS
1. Create lambda function
2. Copy all file in AWS folder to lambda function
3. Set your FTX key pair, currency and funding rate you want to environment variables (FTX_API_KEY, FTX_API_SECRET, CURRENCY and RATE)
4. test and deploy lambda function
5. Create job to execute lambda function by EventBridge

## Run cron job in GCP
1. Follow below webpage to create Cloud function and cloud Scheduler job
https://cloud.google.com/scheduler/docs/tut-pub-sub
2. Copy all file in GCP folder to Cloud Function
3. Set your FTX key pair and currency you want to runtime environment variables (FTX_API_KEY & FTX_API_SECRET & CURRENCY)

## Deployment (Support AWS only)
1. Install terraform CLI
2. Compress ```ftx-request.js```, ```https-request.js``` and ```index.js``` to a zip file named ```lambda_function_payload.zip```
3. Copy lambda_function_payload.zip to terraform folder
4. Modify your FTX API key(variable.ftx_api_key)/secret(variable.ftx_api_secret) in ```main.tf``` 
5. Run command ```terraform init``` to install terrafrom provider
6. Run command ```terraform apply``` to deploy FTX funding stake
7. Your FTX funding stake will deployed in AWS N.Virginia (us-east-1) region