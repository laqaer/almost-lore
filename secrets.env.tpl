# Secrets for the ops worker. Names and 1Password references only; never put a value in this file.
# Create the webhook and its secret with ~/.agents/scripts/stripe-setup (stripe.json), then push the values with ~/.agents/scripts/push-secrets. See ~/.agents/docs/secrets.md.
# stripe.json and these references declare the live configuration only.
# Test purchases require an isolated worker and a separate test-mode webhook endpoint.
# That worker needs a test STRIPE_SECRET_KEY paired with that endpoint's test STRIPE_WEBHOOK_SECRET.
# Do not replace only STRIPE_SECRET_KEY on the live worker.
# target: cloudflare-worker almost-lore-ops
# cloudflare-account: de80edcd32893f7153e5b793ad8317f9
STRIPE_SECRET_KEY=op://Projects/Stripe/credential
STRIPE_WEBHOOK_SECRET=op://Projects/Almost Lore webhook/credential
