# user-center API

## Types

```ts
interface MyProjectRecord {
  id: number;
  name: string;
  description: string;
  peopleNumber: number;
  contributors: { name: string; email: string; avatar: string }[];
}

interface MyTeamRecord {
  id: number;
  avatar: string;
  name: string;
  peopleNumber: number;
}

interface LatestActivity {
  id: number;
  title: string;
  description: string;
  avatar: string;
}

interface EnterpriseCertificationModel { /* ... */ }
interface UnitCertification { enterpriseInfo: EnterpriseCertificationModel; record: CertificationRecord }
```

## Functions

- `queryMyProjectList()` — POST `/api/user/my-project/list`
- `queryMyTeamList()` — POST `/api/user/my-team/list`
- `queryLatestActivity()` — POST `/api/user/latest-activity`
- `saveUserInfo()` — POST `/api/user/save-info`
- `queryCertification()` — POST `/api/user/certification`
- `userUploadApi(data: FormData, config)` — POST `/api/user/upload`

## Example

```ts
import { queryMyProjectList } from '@/api/user-center';

const { data } = await queryMyProjectList();
```
