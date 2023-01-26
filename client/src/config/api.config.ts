import { Configuration } from '@openapi/configuration';

const configuration = new Configuration({
  accessToken: localStorage.getItem('accessToken') || '',
  baseOptions: {
    withCredentials: true
  }
});

export const apiConfig = configuration;
