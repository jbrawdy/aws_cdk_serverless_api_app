import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class ServerlessCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // here comes the code

    // --- dynamo db ---
    const table = new dynamodb.Table(this, 'people', {
      partitionKey: {name: 'name', type: dynamodb.AttributeType.STRING},
      tableName: 'serverless_users_cdk_table'
    });

  

   // --- my first api gateway ---
   const api = new apigw.RestApi(this, 'streamAPIGateway');


    // --- Lambda hello ----
    const welcomeLambda = new lambda.Function(this, 'HelloHandler', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'hello.handler'
    });

 
    // greater lambda integration
    const apiHelloInteg = new apigw.LambdaIntegration(welcomeLambda);
    const apiHello = api.root.addResource('hello');
    apiHello.addMethod('GET', apiHelloInteg);



    // --- user input lambda ----
    const createLambda = new lambda.Function(this, 'CreateHandler', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'creatuser.handler'
    });



    // --- user input lambda integration ---
    const apiCreateInteg = new apigw.LambdaIntegration(createLambda);
    const apiCreate = api.root.addResource('create');
    apiCreate.addMethod('POST', apiCreateInteg);

    // --- table permisions ---
    table.grantReadWriteData(createLambda);


    // --- user read lambda ----
    const readLambda = new lambda.Function(this, 'ReadHandler', {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'readuser.handler'
    });

  

    // --- user read lambda integration ---
    const apiReadInteg = new apigw.LambdaIntegration(readLambda);
    const apiRead = api.root.addResource('read');
    apiRead.addMethod('GET', apiReadInteg);

    // --- table read permisions ---
    table.grantReadData(readLambda);

  }
}
