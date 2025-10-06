# useUser

- `logout(logoutTo?: string)` — logs out and redirects to login (or named route)

```ts
import useUser from '@/hooks/user';
const { logout } = useUser();
await logout();
```
