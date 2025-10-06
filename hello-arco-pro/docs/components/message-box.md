# MessageBox

Displays notifications/messages list with actions.

## Child: `MessageBoxList`

### Props
- `renderList: MessageListType` (required)
- `unreadCount: number = 0`

### Emits
- `itemClick: (items: MessageRecord[])`

## Example
```vue
<MessageBox />
```
