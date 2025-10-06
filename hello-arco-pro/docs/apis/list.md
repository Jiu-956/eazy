# list API

## Types

```ts
interface PolicyRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
```

## Functions

- `queryPolicyList(params: PolicyParams)`
  - GET `/api/list/policy`
  - Fetch paginated policy list. Uses `query-string` for params serialization.

- `queryInspectionList()`
  - GET `/api/list/quality-inspection`

- `queryTheServiceList()`
  - GET `/api/list/the-service`

- `queryRulesPresetList()`
  - GET `/api/list/rules-preset`

## Example

```ts
import { queryPolicyList } from '@/api/list';

const { data } = await queryPolicyList({ current: 1, pageSize: 10 });
console.log(data.list, data.total);
```
