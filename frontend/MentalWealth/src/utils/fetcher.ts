import { Fetcher } from 'openapi-typescript-fetch'
import { getApiState } from '../store/apiStore';
import { paths } from '../schema'

export const fetcher = Fetcher.for<paths>();

fetcher.configure({
    baseUrl: '/api',
    init: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
    use: [
        async (url, init, next) => {
            init.headers.append("Authorization", 'Bearer ' + getApiState().authToken);
            const res = await next(url, init);
            return res;
        },
    ],
});

