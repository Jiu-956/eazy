# user API

## Types

```ts
interface LoginData { username: string; password: string }
interface LoginRes { token: string }
```

## Functions

- `login(data: LoginData)`
  - POST `/api/user/login`

- `logout()`
  - POST `/api/user/logout`

- `getUserInfo()`
  - POST `/api/user/info`

- `getMenuList()`
  - POST `/api/user/menu`

## Example

```ts
import { login, getUserInfo } from '@/api/user';

await login({ username: 'admin', password: 'admin' });
const { data: user } = await getUserInfo();
```
