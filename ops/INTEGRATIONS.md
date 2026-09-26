# Integrations

No secret values belong in this file.

| System | What we saw on 2026-09-26 | Used for |
| --- | --- | --- |
| GitHub `laqaer/almost-lore` | Public repo. Production deploy follows `main`. Local snapshot had been behind `9de2c6e`. | Source of truth for the site. |
| Vercel project `almost-lore` (`prj_keTVjcr990v73HoDJ7ediMAN77YE`) | Hobby user `laqaer-7370`, account `laqaers-projects`. Domains: almostlore.com, www, vercel.app hosts. Env var list was empty. Some team-scoped calls returned 403 until re-auth. | Production hosting. Static export. |
| Cloudflare account `Laqaer Products` | Workers free tier. Subdomain `laqaer-products`. Zone for almostlore.com is not on this account. | Worker `almost-lore-ops` only. Do not deploy over the script name `almost-lore`; that name is reserved for the static-export migration. |
| Stripe | MCP not authenticated. | Required before the $9 button can appear. |
| Gmail | Connected. Search for Almost Lore mail returned nothing. | Not used to send. The published address has no MX. |
| OpenSEO | Account connected, 0 credits. | Not called for paid research. |
| Junction | README at `21f529e17bd98150a3ccd6ee972055dc2858d151`. Local control plane. Not running in this environment. | Not adopted. A loopback app is not this site’s runtime. |
| Forge | Separate repository. Its merge rules govern Forge, not this repo. | Not adopted. |
| agent-prompts `AUTHORITY.md` | SHA `4c6b5bddc9bdc3cf5f6f798cb4b29b90773dc9d4`. Defaults do not override this repo. | Read. Not pinned as a gate on this site. |

Spend rule in force: $0 new discretionary spend. The worker refuses paid APIs other than Stripe, and Stripe is unset.
