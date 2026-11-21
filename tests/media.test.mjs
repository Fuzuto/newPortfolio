import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

test('each portfolio media reference resolves to a bundled file', async () => {
  const components = new URL('../src/portfolio/', import.meta.url);
  const filenames = await readdir(components);
  const sources = await Promise.all(filenames.map((name) => readFile(new URL(name, components), 'utf8')));
  const references = new Set(sources.flatMap((source) =>
    [...source.matchAll(/\/media\/portfolio\/[a-z0-9-]+\.(?:png|webp|jpg|mp4|mp3)/g)].map(([path]) => path),
  ));

  assert.ok(references.size > 0);
  for (const path of references) {
    const media = await stat(new URL('../public' + path, import.meta.url));
    assert.ok(media.isFile() && media.size > 0, path);
  }
});

test('each technology icon is bundled', async () => {
  const source = await readFile(new URL('../src/portfolio/profile.ts', import.meta.url), 'utf8');
  const icons = new Set([...source.matchAll(/\bicon: '([a-z0-9-]+)'/g)].map(([, icon]) => icon));
  assert.ok(icons.size > 0);
  for (const icon of icons) {
    const markup = await readFile(new URL('../public/icons/' + icon + '.svg', import.meta.url), 'utf8');
    assert.match(markup, /<svg\b/, icon);
  }
});
