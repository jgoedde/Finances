# DB sessions via better-auth

Auth uses better-auth: opaque session token in an `httpOnly` `SameSite=Strict` cookie, sessions stored in SQLite, username plugin plus admin plugin, custom invite table. Not Basic Auth, not JWT.

Why: "stateless backend" means no in-memory state, not "no session table". Basic Auth would force the PWA to store the plain password in JS storage and has no logout. JWT has no revocation. A DB lookup per request is cheap at this scale.
