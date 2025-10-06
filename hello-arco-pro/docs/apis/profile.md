# profile API

## Types

```ts
interface ProfileBasicRes {
  status: number;
  video: {
    mode: string;
    acquisition: { resolution: string; frameRate: number };
    encoding: {
      resolution: string;
      rate: { min: number; max: number; default: number };
      frameRate: number;
      profile: string;
    };
  };
  audio: {
    mode: string;
    acquisition: { channels: number };
    encoding: { channels: number; rate: number; profile: string };
  };
}

type operationLogRes = Array<{
  key: string;
  contentNumber: string;
  updateContent: string;
  status: number;
  updateTime: string;
}>;
```

## Functions

- `queryProfileBasic()`
  - GET `/api/profile/basic`

- `queryOperationLog()`
  - GET `/api/operation/log`

## Example

```ts
import { queryProfileBasic } from '@/api/profile';

const { data } = await queryProfileBasic();
console.log(data.video.encoding.profile);
```
