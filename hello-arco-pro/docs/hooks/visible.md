# useVisible

`useVisible(initValue?: boolean = false)`

Returns reactive visibility helpers.

- `visible: Ref<boolean>`
- `setVisible(value: boolean)`
- `toggle()`

```ts
import useVisible from '@/hooks/visible';

const { visible, toggle } = useVisible();
```
