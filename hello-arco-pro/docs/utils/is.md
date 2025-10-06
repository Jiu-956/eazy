# is

Type guard helpers.

- `isArray(obj): obj is any[]`
- `isObject(obj): obj is Record<string, any>`
- `isString(obj): obj is string`
- `isNumber(obj): obj is number`
- `isRegExp(obj): boolean`
- `isFile(obj): obj is File`
- `isBlob(obj): obj is Blob`
- `isUndefined(obj): obj is undefined`
- `isNull(obj): obj is null`
- `isFunction(obj): obj is Function`
- `isEmptyObject(obj): boolean`
- `isExist(obj): boolean` (treats 0 as existing)
- `isWindow(el): el is Window`

```ts
import { isArray, isEmptyObject } from '@/utils/is';

if (isArray([])) {}
console.log(isEmptyObject({}));
```
