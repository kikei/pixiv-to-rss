# Pixiv2Rss

This is a personal project that turns Pixiv updates into an RSS feed using  
AWS Lambda.

## Overview

The application runs on AWS Lambda, and the infrastructure is defined using  
AWS CDK.

The main source code and deployment instructions are located in the `app/`  
directory.  
Please refer to [`app/README.md`](./app/README.md) for more details.

## Running in Docker

You can use the provided helper script to interact with AWS CLI and deploy  
the application from within a Docker container. This is useful if you want  
to avoid installing Node.js, CDK, or the AWS CLI on your host machine.

### Requirements

Before using the script, place your AWS credentials and config files in the  
following directory:

- `docker/data/aws/config`
- `docker/data/aws/credentials`

### Example: Deploying with CDK inside Docker

To deploy the application from within the Docker container:

```sh
./docker/docker.sh -b
```

Then inside the container:

```sh
cd app
npm clean-install
npm run cdk deploy
```

## License

This project is released under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
