# monitor

Global error handler registration.

Default export: `handleError(app: App, baseUrl: string)`

- If `baseUrl` is provided, sets `app.config.errorHandler` to POST error payloads to `${baseUrl}/report-error`.

```ts
import { createApp } from 'vue';
import App from './App.vue';
import handleError from '@/utils/monitor';

const app = createApp(App);
handleError(app, 'https://api.example.com');
app.mount('#app');
```
