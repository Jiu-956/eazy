# auth utilities

Token helpers backed by `localStorage`.

## API
- `isLogin(): boolean` — whether a token exists
- `getToken(): string | null`
- `setToken(token: string): void`
- `clearToken(): void`

## Example

```ts
import { setToken, isLogin, clearToken } from '@/utils/auth';

setToken('jwt');
console.log(isLogin());
clearToken();
```
