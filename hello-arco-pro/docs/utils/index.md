# index

- `openWindow(url: string, opts?: { target?: '_self'|'_parent'|'_blank'|'_top'; ... })`
  - Wrapper around `window.open` with extra features.
- `regexUrl: RegExp`
  - Matches URLs (http/https/ftp or localhost)

## Example
```ts
import { openWindow, regexUrl } from '@/utils';
openWindow('https://arco.design', { target: '_blank' });
console.log(regexUrl.test('https://example.com'));
```
