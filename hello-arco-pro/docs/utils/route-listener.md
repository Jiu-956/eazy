# route-listener

Pub/sub for route changes.

- `setRouteEmitter(to: RouteLocationNormalized)` — emit route change
- `listenerRouteChange(handler, immediate = true)` — subscribe to changes
- `removeRouteListener()` — remove subscription

```ts
import { listenerRouteChange, removeRouteListener } from '@/utils/route-listener';

listenerRouteChange((route) => {
  console.log('route changed', route.fullPath);
});

// later
removeRouteListener();
```
