# GlobalSetting

Opens a settings drawer to tweak layout/theme.

## Emits
- `cancel`

## Subcomponents
- `Block` — renders a list of options and writes to app store
  - Props:
    - `title: string`
    - `options: { name: string; key: string; type?: string; defaultVal?: boolean|string|number }[]`
- `FormWrapper` — switch/number input wrapper
  - Props:
    - `type: 'switch' | 'number'`
    - `name: string`
    - `defaultValue: string | boolean | number`
  - Emits:
    - `inputChange: ({ key, value })`

## Example
```vue
<GlobalSetting @cancel="onClose" />
```
