# AeroReserve Ticket Generation Service

This project contains source code and supporting files for the ticket generation service, a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- lambda-function - Code for the application's Lambda function.
- events - Invocation events that you can use to invoke the function.
- lambda-function/tests - Unit tests for the application code. 
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

The application generates a ticket id when a GET request is made to the `/ticket` endpoint. The ticket id is a UUID that is generated using the `uuid` npm package.

## Deploy the application to AWS

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 20](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy
```

The first command will build the source of your application. The second command will package and deploy your application to AWS.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

We then need to deploy the CodePipeline that will build and deploy the application when changes are made to the source code. First, we have to create the resources needed for the pipeline. To do this, run the following in your shell:

```bash
sam pipeline init --bootstrap
```

A range of questions will be asked to configure the pipeline, do the following:
1. Select a pipeline template to get started: AWS Quick Start Pipeline Templates (1)
2. Select CI/CD system: AWS CodePipeline (5)
3. Which pipeline template would you like to use? Two-stage pipeline (1)
4. Do you want to go through stage setup process now? [Y/n]:
For the rest of the questions, you can press enter to use the default values.

Once this completes the following resources were created in your account:
  - Pipeline IAM user
  - Pipeline execution role
  - CloudFormation execution role
  - Artifact bucket

For more information on how to deploy the pipeline, see the [AWS SAM Workshop]](https://catalog.workshops.aws/complete-aws-sam/en-US/module-4-cicd/module-4-cicd-codepipeline/50-sampipeinit). 


Now you can create a new CloudFormation stack which will set up our CI/CD pipeline. We will use the `sam deploy` command to launch this new stack.

``` 
sam deploy -t codepipeline.yaml --stack-name aeroreserve-ticket-generation-service-pipeline --capabilities=CAPABILITY_IAM
```

Once the aeroreserve-ticket-generation-service-pipeline CloudFormation stack has completed, you will have a new CodePipeline pipeline. This pipeline will automatically build and deploy your application whenever you push changes to the source code repository.

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
aeroreserve-ticket-generation-service$ sam build
```

The SAM CLI installs dependencies defined in `lambda-function/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run the function locally and invoke it with the `sam local invoke` command.

```bash
aeroreserve-ticket-generation-service$ sam local invoke AeroReserveTicketGenerationService --event events/event.json
```

The SAM CLI can also emulate the application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
aeroreserve-ticket-generation-service$ sam local start-api
aeroreserve-ticket-generation-service$ curl http://localhost:3000/ticket
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        AeroReserveTicketGenerationService:
          Type: Api
          Properties:
            Path: /ticket
            Method: get
```

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.


```bash
aeroreserve-ticket-generation-service$ sam logs -n AeroReserveTicketGenerationService --stack-name aeroreserve-ticket-generation-service --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests can be defined in the `lambda-function/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
aeroreserve-ticket-generation-service$ cd lambda-function
aeroreserve-ticket-generation-service$ npm install
aeroreserve-ticket-generation-service$ npm run test
```

## Cleanup

To delete the application that you created, use the AWS CLI. 

```bash
sam delete --stack-name aeroreserve-ticket-generation-service
```