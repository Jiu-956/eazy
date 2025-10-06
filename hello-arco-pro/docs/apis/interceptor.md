# axios interceptor

Configures global request and response interceptors for Axios.

## Types

```ts
interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}
```

## Behavior
- Adds `Authorization: Bearer <token>` header if token exists via `getToken()`.
- Normalizes responses to `HttpResponse<T>` and rejects when `code !== 20000`.
- For codes in `[50008, 50012, 50014]`, triggers a modal to re-login and resets store.
- Base URL is set from `import.meta.env.VITE_API_BASE_URL` if provided.

## Usage

```ts
// Importing this module anywhere ensures interceptors are registered
import '@/api/interceptor';

// Then use normal axios or project API functions
```
