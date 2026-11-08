# OIDC is a sign-in method, not a gate

One generic OIDC identity provider per instance (better-auth `genericOAuth`, env-configured, off when unset). It only adds a sign-in method:

- Users still come only from invites or the admin bootstrap. An unknown IdP identity is rejected, never auto-provisioned; the admin role never comes from claims. An identity is `(issuer, sub)` and links to at most one user.
- An OIDC sign-in creates the same 90-day local session as a password sign-in. IdP tokens are not used afterwards, so IdP revocation only takes effect at the next sign-in; sign-out is local.
- The OAuth state cookie is `SameSite=Lax` (amends 0002): the IdP's redirect back is cross-site, and browsers drop `Strict` cookies on it. The session cookie stays `Strict`.

Why: password users must keep working alongside SSO users, and one rule ("every user comes from an invite") is simpler than an IdP group filter. A PWA offline for days can't depend on IdP token lifetimes. Password reset links stay the recovery path if the IdP goes away.
