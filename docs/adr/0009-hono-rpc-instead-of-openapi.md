# The web client is typed by Hono RPC, not generated from OpenAPI

The web client should stop compiling as soon as the API changes in a way it doesn't match, and nobody should maintain the API contract by hand. We get that from Hono RPC: the API exports the type of its router (`AppType`), the web imports only that type and calls the API through `hc<AppType>`, so paths, params, query, bodies, responses and error codes are inferred straight from the endpoints. We considered generating an `openapi.json` from the API, committing it, checking it for drift in CI and generating a fetch client from it. We rejected that because the only consumer is our own TypeScript client: OpenAPI would need a response schema for every endpoint, a codegen toolchain and a drift check, and would only buy API docs and clients in other languages, which we don't need. If we ever do, `hono-openapi` can add a spec on top of the same routes.

## Consequences

- The web type check compiles the API's sources (it imports `AppType` from `@finances/api`), so they must also type-check under the web's compiler options.
- Routers must be mounted as one chained expression (`.route(...)`), not in a loop, or the router type loses its routes.
- Error codes the client words are derived from the router type, plus a short explicit list for codes that middleware, validators and the error handler send, which Hono doesn't infer. The client's messages must cover exactly those codes, so a new or removed code fails the build.
