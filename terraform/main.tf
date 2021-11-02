provider "aws" {
  region  = "us-east-1"
}

variable "currency" {
    type        = string
    description = "FTX funding currency type"
    default     = "USDT,USD"
}

variable "ftx_api_key" {
    type        = string
    description = "FTX account API key"
    default     = "<Your FTX API key goes here.>"
}

variable "ftx_api_secret" {
    type        = string
    description = "FTX account API secret"
    default     = "<Your FTX API secret goes here.>"
}

variable "rate" {
    type        = number
    description = "FTX funding rate"
    default     = 1
}

resource "aws_iam_role" "iam_role_for_lambda" {
    name = "IAM-ROLE-LAMBDA-EXECUTION"

    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "attach_to_iam_role" {
    name       = "AWSLambdaBasicExecutionRole"
    roles      = [aws_iam_role.iam_role_for_lambda.name]
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    depends_on = [
        aws_iam_role.iam_role_for_lambda
    ]
}

resource "aws_lambda_function" "lambda" {
    filename      = "lambda_function_payload.zip"
    function_name = "FTX-FUNDING-UPDATE"
    role          = aws_iam_role.iam_role_for_lambda.arn
    handler       = "index.handler"
    architectures = ["arm64"]
    description   = "Update FTX funding"
    memory_size   = 128
    timeout       = 15
    runtime       = "nodejs14.x"

    environment {
        variables = {
            CURRENCY       = var.currency,
            FTX_API_KEY    = var.ftx_api_key,
            FTX_API_SECRET = var.ftx_api_secret,
            RATE           = var.rate
        }
    }

    depends_on = [
        aws_iam_policy_attachment.attach_to_iam_role
    ]
}

resource "aws_cloudwatch_event_rule" "every_hour" {
    name                = "UPDATE-FTX"
    description         = "Update FTX funding rate every hour"
    schedule_expression = "cron(15 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "invoke_lambda" {
    rule      = aws_cloudwatch_event_rule.every_hour.name
    target_id = "FTX-FUNDING-UPDATE"
    arn       = aws_lambda_function.lambda.arn

    depends_on = [
        aws_cloudwatch_event_rule.every_hour,
        aws_lambda_function.lambda
    ]
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.lambda.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.every_hour.arn

    depends_on = [
        aws_cloudwatch_event_rule.every_hour,
        aws_cloudwatch_event_target.invoke_lambda,
        aws_lambda_function.lambda
    ]
}