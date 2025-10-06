# useLocale

Leverages `vue-i18n` to get and change current locale; persists to localStorage.

- `currentLocale: ComputedRef<string>`
- `changeLocale(value: string)`

```ts
import useLocale from '@/hooks/locale';
const { currentLocale, changeLocale } = useLocale();
```
