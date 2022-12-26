import { createHmac } from 'crypto';

export const awsCognitoSecretHash = (username: string, clientId: string, clientSecret: string) => {
  const hasher = createHmac('sha256', clientSecret);
  hasher.update(`${username}${clientId}`);
  return hasher.digest('base64');
};
