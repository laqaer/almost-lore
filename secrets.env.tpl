# Secrets for the ops worker. Names and 1Password references only; never put a value in this file.
# Create the webhook and its secret with ~/.agents/scripts/stripe-setup (stripe.json), then push the values with ~/.agents/scripts/push-secrets. See ~/.agents/docs/secrets.md.
# To test first, point STRIPE_SECRET_KEY at op://Projects/Stripe test/credential, push, buy with card 4242 4242 4242 4242,
# then point it back at the live item and push again.
# target: cloudflare-worker almost-lore-ops
# cloudflare-account: de80edcd32893f7153e5b793ad8317f9
STRIPE_SECRET_KEY=op://Projects/Stripe/credential
STRIPE_WEBHOOK_SECRET=op://Projects/Almost Lore webhook/credential
