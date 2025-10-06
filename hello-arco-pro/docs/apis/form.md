# form API

## Types

```ts
interface BaseInfoModel {
  activityName: string;
  channelType: string;
  promotionTime: string[];
  promoteLink: string;
}

interface ChannelInfoModel {
  advertisingSource: string;
  advertisingMedia: string;
  keyword: string[];
  pushNotify: boolean;
  advertisingContent: string;
}

type UnitChannelModel = BaseInfoModel & ChannelInfoModel;
```

## Functions

- `submitChannelForm(data: UnitChannelModel)`
  - POST `/api/channel-form/submit`
  - Submit multi-step form payload.

## Example

```ts
import { submitChannelForm } from '@/api/form';

await submitChannelForm({
  activityName: 'Promo',
  channelType: 'email',
  promotionTime: ['2023-01-01', '2023-01-10'],
  promoteLink: 'https://example.com',
  advertisingSource: 'google',
  advertisingMedia: 'search',
  keyword: ['arco', 'vue'],
  pushNotify: true,
  advertisingContent: 'New Year Promo',
});
```
