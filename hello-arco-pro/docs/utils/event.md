# event

DOM event helpers.

- `addEventListen(target, event, handler, capture?)`
- `removeEventListen(target, event, handler, capture?)`

```ts
import { addEventListen, removeEventListen } from '@/utils/event';

function onResize() {}
addEventListen(window, 'resize', onResize);
removeEventListen(window, 'resize', onResize);
```
