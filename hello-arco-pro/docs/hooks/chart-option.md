# useChartOption

`useChartOption((isDark: boolean) => EChartsOption)`

Computes chart options with theme awareness via app store.

- `chartOption: ComputedRef<EChartsOption>`

```ts
import useChartOption from '@/hooks/chart-option';

const { chartOption } = useChartOption((isDark) => ({
  backgroundColor: isDark ? '#000' : '#fff',
}));
```
