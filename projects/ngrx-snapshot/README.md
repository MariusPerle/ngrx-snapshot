# Ngrx Snapshot

Get a snapshot of [Ngrx Store](https://ngrx.io/)  with the latest actions and state to use with [Devtools](https://github.com/reduxjs/redux-devtools)

## Usage
Your App module needs

```typescript
@NgModule({
    imports: [
        NgrxSnapshotModule.forRoot(actionAmount),
    ]
})
```

Snapshot is available via getSnapshot() of [NgrxSnapshotService](src/lib/ngrx-snapshot.service.ts)
