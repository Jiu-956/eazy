# v-permission

Directive to conditionally render elements based on user role from store.

Install via plugin in `src/directive/index.ts`.

## Usage

```vue
<template>
  <button v-permission="['admin','user']">Visible to roles</button>
</template>
```

- Expects an array of roles. If the current role (from `useUserStore().role`) is not included, the element is removed from DOM.
- Throws if the binding value is not an array.
