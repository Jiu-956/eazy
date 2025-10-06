# dashboard API

## Types

```ts
interface ContentDataRecord {
  x: string;
  y: number;
}

interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}
```

## Functions

- `queryContentData(): Promise<AxiosResponse<ContentDataRecord[]>>`
  - GET `/api/content-data`
  - Returns content data points for charts.

- `queryPopularList(params: { type: string }): Promise<AxiosResponse<TableData[]>>`
  - GET `/api/popular/list`
  - Query popular list by type.

## Example

```ts
import { queryContentData, queryPopularList } from '@/api/dashboard';

async function load() {
  const { data: content } = await queryContentData();
  const { data: list } = await queryPopularList({ type: 'week' });
  console.log(content, list);
}
```
