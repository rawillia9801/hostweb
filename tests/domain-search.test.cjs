const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('app/api/domains/search/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function route(fetch, key = 'test-only-key') {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Buffer, AbortSignal, fetch,
    process: { env: { TWENTYI_GENERAL_API_KEY: key } },
    console: { error() {} },
    require: (name) => {
      assert.equal(name, 'next/server');
      return { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } };
    },
  });
  return (domain) => exports.GET({ nextUrl: new URL(`https://hostmyweb.co/api/domains/search?domain=${encodeURIComponent(domain)}`) });
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const domainOf = (url) => decodeURIComponent(url.split('/').pop());

test('20i documented can:register result supports prices and checked alternatives', async () => {
  const get = route(async (url, options) => {
    assert.equal(options.headers.Authorization, `Bearer ${Buffer.from('test-only-key').toString('base64')}`);
    const name = domainOf(url);
    return json([{ header: { names: [name] } }, { name, can: 'register' }]);
  });
  const result = await get('example-test.com');
  assert.equal(result.status, 200);
  assert.equal(result.body.available, true);
  assert.equal(result.body.availabilityConfirmed, true);
  assert.equal(result.body.price, 17.99);
  assert.equal(result.body.suggestions.length, 4);
});

test('20i transfer result is registered; newline-delimited packets are accepted', async () => {
  const result = await route(async (url) => new Response(
    JSON.stringify({ header: { names: [domainOf(url)] } }) + '\n' +
    JSON.stringify({ name: domainOf(url), can: 'transfer' })
  ))('abc.com');
  assert.equal(result.body.available, false);
  assert.equal(result.body.source, 'reseller');
});

test('unrelated available alternative cannot determine the requested domain', async () => {
  const result = await route(async (url) => url.includes('api.20i.com')
    ? json([{ name: 'another-domain.com', can: 'register' }])
    : json({ objectClassName: 'domain', ldhName: domainOf(url).toUpperCase() })
  )('abc.com');
  assert.equal(result.body.available, false);
  assert.equal(result.body.source, 'registry');
});

test('provider failure falls back directly to the .com registry', async () => {
  const seen = [];
  const result = await route(async (url) => {
    seen.push(url);
    if (url.includes('api.20i.com')) return json({}, 401);
    return json({ objectClassName: 'domain', ldhName: domainOf(url) });
  })('abc.com');
  assert.equal(result.body.available, false);
  assert.ok(seen.includes('https://rdap.verisign.com/com/v1/domain/abc.com'));
});

test('registry missing domain requires checkout confirmation', async () => {
  const result = await route(async () => json({ errorCode: 404 }, 404), '')('unregistered-example.com');
  assert.equal(result.body.available, true);
  assert.equal(result.body.availabilityConfirmed, false);
});

test('HTML 404, rate limit and network failure never claim availability', async () => {
  for (const fetch of [
    async () => new Response('<html>not found</html>', { status: 404 }),
    async () => json({ errorCode: 429 }, 429),
    async () => { throw new Error('timeout'); },
  ]) {
    const result = await route(fetch, '')('abc.com');
    assert.equal(result.status, 503);
    assert.equal(result.body.available, undefined);
  }
});

test('suggestion-only provider responses are not confirmed availability', async () => {
  const result = await route(async (url) => url.includes('api.20i.com')
    ? json({ name: domainOf(url), suggestion: true, available: true })
    : json({ objectClassName: 'domain', ldhName: domainOf(url) })
  )('abc.com');
  assert.equal(result.body.available, false);
});

test('invalid input never calls a provider', async () => {
  const result = await route(async () => { assert.fail('unexpected network call'); })('bad domain.com');
  assert.equal(result.status, 400);
});
