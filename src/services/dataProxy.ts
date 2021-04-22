import axios from 'axios';
export { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import JSONbig from 'json-bigint';

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 1000;
  },
  retryCondition: error => {
    const testHeader = error?.config?.headers?.testHeader;
    const retry = !testHeader;
    if (retry) {
      console.log('retrying axios call due to error', error.message);
    }
    return retry;
  },
});

axios.defaults.headers.common.timeout = 10000;

axios.defaults.transformResponse = [
  data => {
    try {
      const myResponse = JSONbig({ useNativeBigInt: true }).parse(data);
      return { response: myResponse };
    } catch (_) {
      return { response: JSON.parse(data) };
    }
  },
];

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const toReturn = {
      data: {
        error: { message: error.message },
      },
    };

    return toReturn;
  },
);

export default axios;
