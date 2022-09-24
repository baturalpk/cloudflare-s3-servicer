## cloudflare-s3-servicer

### 🔥 How to deploy?

---

0. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/) and
   authenticate to your Cloudflare account.

1. 🤫 Create required AWS secrets for the project:

   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_DEFAULT_REGION
   - AWS_S3_BUCKET

> **Hint:** Add each secret variable via `wrangler secret put` command.

2. 🔎 Review [`wrangler.toml`](./wrangler.toml) file and modify it depending on your requirements.

3. Publish to Cloudflare via `wrangler publish`.
