import { Client, Databases } from 'node-appwrite';

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '') // https://nyc.cloud.appwrite.io/v1
    .setProject(process.env.APPWRITE_PROJECT_ID || '') // 6925ff2b001511b5e0ea
    .setKey(process.env.APPWRITE_API_KEY || ''); // standard_95627931451efa78470ec518964501f8cb43064b19a761a27e5f8c1ce4fd3d490a1f83e1fa59e5da93c960c4e1c489e77ed5ecf4c083fd521d62129a19581cbeecf395f18870747b6005b06f54e984a285f364099beb7dfb64f199460a1bb28f8635d6f83dd2be2f48c5636fae0bbc7eac1109f3b04b2ee1d9ca7d339f89bcba

export const databases = new Databases(client);
