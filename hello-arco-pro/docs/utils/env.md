# env

Exports `debug: boolean` which is `true` unless `import.meta.env.MODE === 'production'`.

## Example
```ts
import debug from '@/utils/env';
if (debug) console.log('debug mode');
```
