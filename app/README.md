# Pixiv2RssStack

An experimental AWS Lambda stack that fetches updates from Pixiv and
converts them into RSS. This project is for personal prototyping
purposes.

## Setup

### External library

Clone the following library manually:

```sh
cd ..
git clone https://github.com/alphasp/pixiv-api-client.git
```

You might be able to install it via NPM, but I don't remember why I
chose to clone it instead.

## Typical Commands

### Deploy

Use CDK to deploy the stack:

```sh
npm run cdk diff
npm run cdk deploy
```

### Run

To manually invoke the Lambda function:

```sh
aws lambda invoke --function-name Pixiv2RssStack-ApiFunction /dev/stdout
```

### Register configuration to Parameter Store

Set your Pixiv configuration to AWS Systems Manager Parameter Store:

```sh
aws ssm put-parameter --name Pixiv2Rss --type String --value '{
  "pixiv": {
    "refreshToken": YOUR_PIXIV_USER_ID
  }
}'
```
