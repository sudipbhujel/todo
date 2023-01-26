import { Configuration } from '@openapi/configuration';

// console.log('Env = ', process.env);

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
  accessToken: localStorage.getItem('accessToken') || '',
  baseOptions: {
    withCredentials: true
  }
});

export const apiConfig = configuration;
