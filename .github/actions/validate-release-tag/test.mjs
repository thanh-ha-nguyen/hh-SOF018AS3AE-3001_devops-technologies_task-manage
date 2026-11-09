import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const action = fileURLToPath(new URL('./index.js', import.meta.url));

test('accepts a semantic release tag and writes its version output', () => {
  const directory = mkdtempSync(join(tmpdir(), 'release-tag-action-'));
  const output = join(directory, 'github-output');

  try {
    const result = spawnSync(process.execPath, [action], {
      env: { ...process.env, GITHUB_OUTPUT: output, INPUT_TAG: 'v1.2.3' },
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(output, 'utf8'), 'version=1.2.3\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects tags that are not v-prefixed semantic versions', () => {
  const result = spawnSync(process.execPath, [action], {
    env: { ...process.env, GITHUB_OUTPUT: 'unused', INPUT_TAG: 'release-1.2' },
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /vMAJOR\.MINOR\.PATCH/);
});
