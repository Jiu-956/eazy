# message API

## Types

```ts
interface MessageRecord {
  id: number;
  type: string;
  title: string;
  subTitle: string;
  avatar?: string;
  content: string;
  time: string;
  status: 0 | 1;
  messageType?: number;
}

type MessageListType = MessageRecord[];

interface ChatRecord {
  id: number;
  username: string;
  content: string;
  time: string;
  isCollect: boolean;
}
```

## Functions

- `queryMessageList()`
  - POST `/api/message/list`

- `setMessageStatus(data: { ids: number[] })`
  - POST `/api/message/read`

- `queryChatList()`
  - POST `/api/chat/list`

## Example

```ts
import { queryMessageList, setMessageStatus } from '@/api/message';

const { data: list } = await queryMessageList();
await setMessageStatus({ ids: list.filter(i => !i.status).map(i => i.id) });
```
