# setup-mock

- Default export: `({ mock, setup }: { mock?: boolean; setup: () => void }) => void`
  - Runs `setup()` if `mock !== false` and `debug === true`.
- `successResponseWrap<T>(data: T)` — wraps data into success payload
- `failResponseWrap(data: unknown, msg: string, code = 50000)` — wraps error

```ts
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({ setup: () => console.log('init mocks') });

return successResponseWrap({ hello: 'world' });
```
