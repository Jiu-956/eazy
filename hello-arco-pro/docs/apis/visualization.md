# visualization API

## Types

```ts
interface ChartDataRecord { x: string; y: number; name: string }
interface DataChainGrowth { quota: string }
interface DataChainGrowthRes {
  count: number; growth: number;
  chartData: { xAxis: string[]; data: { name: string; value: number[] } };
}
interface PopularAuthorRes {
  list: { ranking: number; author: string; contentCount: number; clickCount: number }[];
}
interface ContentPublishRecord { x: string[]; y: number[]; name: string }
interface PublicOpinionAnalysis { quota: string }
interface PublicOpinionAnalysisRes { count: number; growth: number; chartData: ChartDataRecord[] }
interface DataOverviewRes { xAxis: string[]; data: Array<{ name: string; value: number[]; count: number }>; }
```

## Functions

- `queryDataChainGrowth(data: DataChainGrowth)` — POST `/api/data-chain-growth`
- `queryPopularAuthor()` — GET `/api/popular-author/list`
- `queryContentPublish()` — GET `/api/content-publish`
- `queryContentPeriodAnalysis()` — POST `/api/content-period-analysis`
- `queryPublicOpinionAnalysis(data: DataChainGrowth)` — POST `/api/public-opinion-analysis`
- `queryDataOverview()` — POST `/api/data-overview`

## Example

```ts
import { queryDataOverview } from '@/api/visualization';
const { data } = await queryDataOverview();
```
