# Chart

Wrapper around `vue-echarts` with SSR-safe delayed render.

## Props
- `options: object = {}` — ECharts option object
- `autoResize: boolean = true`
- `width: string = '100%'`
- `height: string = '100%'`

## Slots
- None

## Example
```vue
<template>
  <Chart :options="option" height="300px" />
</template>
```
