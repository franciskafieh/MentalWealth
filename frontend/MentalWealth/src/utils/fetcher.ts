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
        'Authorization': 'Bearer ' + getApiState().authToken,
      },
    },
});