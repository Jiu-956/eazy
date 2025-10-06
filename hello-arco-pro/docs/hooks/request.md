# useRequest

`useRequest<T>(api: () => Promise<AxiosResponse<HttpResponse>>, defaultValue: T, isLoading = true)`

Runs an API call immediately and returns state.

- `loading: Ref<boolean>`
- `response: Ref<T>`

```ts
import useRequest from '@/hooks/request';
import { queryMessageList } from '@/api/message';

const { loading, response } = useRequest(queryMessageList, []);
```
