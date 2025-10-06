# usePermission

Provides route access checks and helper to find first accessible route.

- `accessRouter(route)`
- `findFirstPermissionRoute(routers, role = 'admin')`

```ts
import usePermission from '@/hooks/permission';
const { accessRouter } = usePermission();
```
