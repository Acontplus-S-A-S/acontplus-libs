# ng-customer

This library was generated with [Nx](https://nx.dev).

## Architecture

We apply a pragmatic Clean Architecture geared for reusable NPM libraries:

- Domain: pure business models and repository contracts
- Application: use-cases (orchestrators) re-exported for public API
- Data: adapters (DTOs, mappers, http repositories) implementing domain contracts
- UI: presentational Angular components

Rules:

- Application depends on Domain only
- Data depends on Domain and third-parties (Angular HTTP, etc.)
- UI depends on Application and Domain; it must not import Data directly

Migration Plan:

1. Keep existing `data/use-cases` but re-export via `lib/application`
2. Gradually move use-case implementations into `application` while keeping signatures stable
3. Enforce import boundaries via lint rules and barrels

Public API:

- `@acontplus/ng-customer` now exports `lib/application` so consumers can import use-cases from a stable layer without touching `data`

## Running unit tests

Run `nx test ng-customer` to execute the unit tests.
