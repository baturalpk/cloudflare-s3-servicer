import { AwsClient } from 'aws4fetch';

const validResourcePathRe = /^((\/[\S]+)?(\/[\S]+)?(\/[\S]+\.[\S]+))$/;

const aws = new AwsClient({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_DEFAULT_REGION,
});

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  try {
    const cache = caches.default;
    let response = await cache.match(event.request);

    if (!response) {
      let url = constructResourceUrl(event.request);
      let signedRequest = await aws.sign(url);
      response = await fetch(signedRequest, {
        cf: {
          cacheTtl: 86400, // 1 day
          cacheEverything: true,
        },
      });
      if (response.status > 399) {
        return response;
      }
      const { headers } = response;
      headers['Cache-Control'] = 'public, max-age=86400';
      response = new Response(response.body, { ...response, headers });
      event.waitUntil(cache.put(event.request, response.clone()));
    }
    return response;
  } catch (err) {
    return new Response(err.body || '', { status: err.status || 500 });
  }
}

function constructResourceUrl(request) {
  let url = new URL(request.url);

  if (url.pathname.match(validResourcePathRe)[0] !== url.pathname) {
    throw new HttpError({
      status: 400,
      body: `Invalid pathname.

      Valid Examples:
      * /track/<name>.<extension>
      * /assets/media/videos/<name>.<extension>
      * /documents/bx01d/0000/<name>.<extension>`,
    });
  }

  url.hostname = AWS_S3_BUCKET;
  url.protocol = 'https:';
  return url;
}

class HttpError extends Error {
  constructor({ status, body }) {
    super('');
    this.status = status;
    this.body = body;
  }
}
