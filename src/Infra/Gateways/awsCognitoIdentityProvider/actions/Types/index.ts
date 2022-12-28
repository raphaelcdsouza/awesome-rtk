import { CognitoIdentityServiceProvider } from 'aws-sdk';

export type AwsCognitoTemplateConstructorParams = {
  cognitoInstance: CognitoIdentityServiceProvider;
  clientId: string;
  clientSecret?: string;
}
