import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

import {
  parseReadmeCatalog,
  resolveCatalogUrl,
} from '../src/lib/catalog.mjs';
import {
  EXPECTED_PROMPT_CATEGORY_COUNTS,
  validatePrompts,
} from '../src/lib/prompts.mjs';
import { matchesPrompt } from '../src/lib/prompt-search.mjs';
import {
  loadPromptRuns,
  sha256PromptRecord,
  sha256Text,
  validatePromptRun,
} from '../src/lib/prompt-runs.mjs';

const repositoryRoot = resolve(import.meta.dirname, '../..');
const runsRoot = resolve(repositoryRoot, 'prompts/runs');
const readme = readFileSync(resolve(repositoryRoot, 'README.md'), 'utf8');
const prompts = JSON.parse(
  readFileSync(
    resolve(repositoryRoot, 'prompts/100-work-efficiency-prompts.json'),
    'utf8',
  ),
);
const reviewRuns = loadPromptRuns({ prompts, runsRoot, policy: 'review' });
const syntheticDisclosure =
  '> 演示输入：合成数据，不代表真实客户/生产结果';

function storedMetadata(promptId) {
  const run = reviewRuns.get(promptId);
  return JSON.parse(
    readFileSync(resolve(runsRoot, run.run_id, 'run.json'), 'utf8'),
  );
}

test('README parser returns every declared non-empty catalog section', () => {
  const result = parseReadmeCatalog(readme);
  assert.equal(result.categories.length, 10);
  assert.ok(result.categories.every(({ items }) => items.length > 0));
  assert.equal(
    result.total,
    result.categories.reduce((sum, { items }) => sum + items.length, 0),
  );
});

test('README parser fails closed on heading, entry, and URL drift', () => {
  assert.throws(
    () =>
      parseReadmeCatalog(
        readme.replace(
          '## Community 社区与讨论',
          '### Community 社区与讨论',
        ),
      ),
    /unknown, missing, or reordered H2 headings/u,
  );
  assert.throws(
    () =>
      parseReadmeCatalog(
        readme.replace('## Contributing', '## Surprise\n\n## Contributing'),
      ),
    /unknown, missing, or reordered H2 headings/u,
  );
  assert.throws(
    () =>
      parseReadmeCatalog(
        readme.replace(
          '- [WorkBuddy 官网（国内版）]',
          '* [WorkBuddy 官网（国内版）]',
        ),
      ),
    /malformed entry/u,
  );
  assert.throws(
    () =>
      parseReadmeCatalog(
        readme.replace('https://www.workbuddy.ai/', 'https://www.workbuddy.cn/'),
      ),
    /duplicate URL/u,
  );
});

test('canonical prompt source URLs route to the local prompt library', () => {
  for (const source of [
    './prompts/100-work-efficiency-prompts.json',
    'https://github.com/staruhub/awesome-workbuddy/blob/main/prompts/100-work-efficiency-prompts.json',
  ]) {
    assert.deepEqual(resolveCatalogUrl(source, '/awesome-workbuddy'), {
      href: '/awesome-workbuddy/prompts/',
      external: false,
      host: '本站 Prompt 库',
    });
  }
  assert.equal(
    resolveCatalogUrl('./docs/example.md', '/awesome-workbuddy').href,
    'https://github.com/staruhub/awesome-workbuddy/blob/main/docs/example.md',
  );
});

test('canonical Prompt data contains exactly ten records in every category', () => {
  const result = validatePrompts(prompts);
  assert.equal(result.prompts.length, 100);
  assert.deepEqual(result.counts, EXPECTED_PROMPT_CATEGORY_COUNTS);
  assert.equal(new Set(result.prompts.map(({ id }) => id)).size, 100);
});

test('Prompt data rejects malformed schema, duplicates, gaps, and count drift', () => {
  const missingField = structuredClone(prompts);
  delete missingField[0].tip;
  assert.throws(() => validatePrompts(missingField), /fields must be exactly/u);

  const duplicateId = structuredClone(prompts);
  duplicateId[1].id = duplicateId[0].id;
  assert.throws(() => validatePrompts(duplicateId), /duplicate id/u);

  assert.throws(
    () => validatePrompts(prompts.slice(0, 99)),
    /expected exactly 100 records/u,
  );

  const categoryDrift = structuredClone(prompts);
  categoryDrift[0].category = 'data-analysis';
  assert.throws(
    () => validatePrompts(categoryDrift),
    /category "deep-research" expected 10/u,
  );
});

test('prompt filtering covers category, all searchable fields, and empty state', () => {
  assert.equal(
    prompts.filter((prompt) =>
      matchesPrompt(prompt, { category: 'meeting' }),
    ).length,
    10,
  );
  assert.deepEqual(
    prompts
      .filter((prompt) =>
        matchesPrompt(prompt, { query: '一键生成竞品对比矩阵' }),
      )
      .map(({ id }) => id),
    [2],
  );
  assert.ok(
    prompts.some((prompt) =>
      matchesPrompt(prompt, { query: prompt.expected_output }),
    ),
  );
  assert.equal(
    prompts.filter((prompt) =>
      matchesPrompt(prompt, {
        category: 'dev',
        query: '绝对不会命中的词',
      }),
    ).length,
    0,
  );
});

test('review loader accepts exactly 100 one-to-one schema-version-2 runs', () => {
  assert.equal(reviewRuns.size, 100);
  assert.deepEqual(
    [...reviewRuns.keys()].sort((a, b) => a - b),
    Array.from({ length: 100 }, (_, index) => index + 1),
  );

  const reviewCounts = { approved: 0, pending: 0 };
  for (const prompt of prompts) {
    const run = reviewRuns.get(prompt.id);
    reviewCounts[run.review.status] += 1;
    assert.equal(run.schema_version, 2);
    assert.equal(run.prompt_id, prompt.id);
    assert.equal(run.prompt_sha256, sha256Text(prompt.prompt));
    assert.equal(run.prompt_record_sha256, sha256PromptRecord(prompt));
    assert.equal(run.output_sha256, sha256Text(run.output));
    assert.match(
      run.run_id,
      new RegExp(`^prompt-${String(prompt.id).padStart(3, '0')}-`, 'u'),
    );
  }
  assert.deepEqual(reviewCounts, { approved: 100, pending: 0 });
});

test('all category counts also have exactly ten run results', () => {
  const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
  const counts = Object.fromEntries(
    Object.keys(EXPECTED_PROMPT_CATEGORY_COUNTS).map((category) => [
      category,
      0,
    ]),
  );
  for (const run of reviewRuns.values()) {
    counts[promptById.get(run.prompt_id).category] += 1;
  }
  assert.deepEqual(counts, EXPECTED_PROMPT_CATEGORY_COUNTS);
});

function normalizedNgrams(output) {
  const normalized = output
    .replace(/^> 演示输入：[^\n]*\n+/u, '')
    .replace(/\s+/gu, '');
  const grams = new Set();
  for (let index = 0; index <= normalized.length - 8; index += 4) {
    grams.add(normalized.slice(index, index + 8));
  }
  return grams;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) intersection += 1;
  }
  return intersection / (left.size + right.size - intersection);
}

test('all outputs are different and do not exhibit obvious template repetition', () => {
  const runs = [...reviewRuns.values()];
  assert.equal(new Set(runs.map((run) => run.output_sha256)).size, 100);

  const grams = runs.map((run) => [
    run.prompt_id,
    normalizedNgrams(run.output),
  ]);
  let maximum = { score: 0, pair: [] };
  for (let left = 0; left < grams.length; left += 1) {
    for (let right = left + 1; right < grams.length; right += 1) {
      const score = jaccard(grams[left][1], grams[right][1]);
      if (score > maximum.score) {
        maximum = { score, pair: [grams[left][0], grams[right][0]] };
      }
    }
  }
  assert.ok(
    maximum.score < 0.2,
    `Prompts ${maximum.pair.join(' and ')} are too similar (${maximum.score})`,
  );
});

test('visible result bodies do not expose runner or run-schema metadata', () => {
  const forbiddenVisibleMetadata =
    /(?:ChatGPT|GPT-5\.6|conversation_url|input_mode|network_research|outcome=|output_sha256|review\.status|实际模型\/界面|执行者：|执行日期：|## 运行记录)/u;

  for (const run of reviewRuns.values()) {
    assert.doesNotMatch(
      run.output,
      forbiddenVisibleMetadata,
      `Prompt ${run.prompt_id} leaks technical provenance into its visible result`,
    );
  }
});

test('synthetic demos disclose their input and remain partial', () => {
  const syntheticRuns = [...reviewRuns.values()].filter(
    (run) => run.input_mode === 'synthetic_demo',
  );
  assert.ok(syntheticRuns.length > 0);
  for (const run of syntheticRuns) {
    assert.equal(run.outcome, 'partial');
    assert.ok(run.input_summary.includes('合成'));
    assert.ok(run.output.startsWith(syntheticDisclosure));
    assert.ok(run.limitations.some((item) => item.includes('合成')));
  }
});

test('prompt-only runs and the single researched run keep honest boundaries', () => {
  const researchedRuns = [...reviewRuns.values()].filter(
    (run) => run.network_research,
  );
  assert.deepEqual(researchedRuns.map((run) => run.prompt_id), [1]);
  assert.equal(reviewRuns.get(1).review.status, 'approved');
  assert.equal(reviewRuns.get(1).input_mode, 'prompt_only');
  assert.equal(reviewRuns.get(1).outcome, 'complete');
  assert.ok(
    [...reviewRuns.values()]
      .filter((run) => run.prompt_id > 1)
      .every((run) => !run.network_research && run.outcome === 'partial'),
  );
});

test('publication gate accepts all 100 independently approved records', () => {
  const publicationRuns = loadPromptRuns({
    prompts,
    runsRoot,
    policy: 'publication',
  });
  assert.equal(publicationRuns.size, 100);
  assert.ok(
    [...publicationRuns.values()].every(
      (run) =>
        run.review.status === 'approved' &&
        run.review.reviewer === 'Codex',
    ),
  );
});

test('schema v2 rejects hash drift, illegal dates, and misleading provenance', () => {
  const prompt = prompts[1];
  const run = reviewRuns.get(prompt.id);
  const metadata = storedMetadata(prompt.id);

  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, prompt_sha256: '0'.repeat(64) },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /prompt_sha256 does not match/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, output_sha256: '0'.repeat(64) },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /output_sha256 does not match/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, executed_at: '2026-02-30T04:00:00Z' },
        run.output,
        prompt,
        { policy: 'review' },
    ),
    /ISO 8601 UTC timestamp/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, executed_at: '2999-01-01T00:00:00Z' },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /must not be in the future/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        {
          ...metadata,
          runner: { ...metadata.runner, product: 'WorkBuddy' },
        },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /runner must equal ChatGPT GPT-5\.6 Sol/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        {
          ...metadata,
          runner: { ...metadata.runner, surface: 'WorkBuddy runtime' },
        },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /not allowed to claim WorkBuddy provenance/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, conversation_url: 'https://chatgpt.com/' },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /must identify the ChatGPT run conversation/u,
  );
});

test('schema v2 rejects missing limits, synthetic deception, and path traversal', () => {
  const prompt = prompts[1];
  const run = reviewRuns.get(prompt.id);
  const metadata = storedMetadata(prompt.id);

  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, limitations: [] },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /limitations must be a non-empty string array/u,
  );

  const undisclosedOutput = run.output.replace(`${syntheticDisclosure}\n\n`, '');
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, output_sha256: sha256Text(undisclosedOutput) },
        undisclosedOutput,
        prompt,
        { policy: 'review' },
      ),
    /synthetic_demo output must begin/u,
  );

  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, outcome: 'complete' },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /synthetic_demo outcome must be partial/u,
  );
  assert.throws(
    () =>
      validatePromptRun(
        { ...metadata, output_file: '../output.md' },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /local Markdown filename/u,
  );
});

test('pending authors cannot populate independent-review identity fields', () => {
  const prompt = prompts[1];
  const run = reviewRuns.get(prompt.id);
  const metadata = storedMetadata(prompt.id);
  assert.throws(
    () =>
      validatePromptRun(
        {
          ...metadata,
          review: {
            ...metadata.review,
            status: 'pending',
            reviewer: 'self',
            reviewed_at: '2026-07-31T05:00:00Z',
          },
        },
        run.output,
        prompt,
        { policy: 'review' },
      ),
    /pending review must keep reviewer and reviewed_at null/u,
  );
});

test('run loader rejects fewer or more than 100 directories', () => {
  const root = mkdtempSync(join(tmpdir(), 'workbuddy-run-count-'));
  try {
    cpSync(runsRoot, root, { recursive: true });
    const directories = readdirSync(root).sort();
    rmSync(join(root, directories.at(-1)), { recursive: true });
    assert.throws(
      () => loadPromptRuns({ prompts, runsRoot: root, policy: 'review' }),
      /expected exactly 100 run directories, received 99/u,
    );

    cpSync(join(root, directories[0]), join(root, 'extra-run'), {
      recursive: true,
    });
    cpSync(join(root, directories[1]), join(root, 'extra-run-2'), {
      recursive: true,
    });
    assert.throws(
      () => loadPromptRuns({ prompts, runsRoot: root, policy: 'review' }),
      /expected exactly 100 run directories, received 101/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('run loader rejects missing files, extra files, and duplicate Prompt input', () => {
  const root = mkdtempSync(join(tmpdir(), 'workbuddy-run-files-'));
  try {
    cpSync(runsRoot, root, { recursive: true });
    const first = readdirSync(root).sort()[0];
    unlinkSync(join(root, first, 'run.json'));
    assert.throws(
      () => loadPromptRuns({ prompts, runsRoot: root, policy: 'review' }),
      /run\.json is missing/u,
    );

    cpSync(join(runsRoot, first, 'run.json'), join(root, first, 'run.json'));
    writeFileSync(join(root, first, 'extra.txt'), 'unexpected\n', 'utf8');
    assert.throws(
      () => loadPromptRuns({ prompts, runsRoot: root, policy: 'review' }),
      /run directory files must be exactly/u,
    );

    const duplicatePrompts = structuredClone(prompts);
    duplicatePrompts[1].id = duplicatePrompts[0].id;
    assert.throws(
      () =>
        loadPromptRuns({
          prompts: duplicatePrompts,
          runsRoot,
          policy: 'review',
        }),
      /duplicate Prompt ids are forbidden/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('run loader rejects symbolic links when the filesystem permits them', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'workbuddy-run-symlink-'));
  try {
    cpSync(runsRoot, root, { recursive: true });
    const directories = readdirSync(root).sort();
    const target = join(root, directories[0]);
    const link = join(root, directories[1]);
    rmSync(link, { recursive: true });
    try {
      symlinkSync(target, link, 'dir');
    } catch {
      t.skip('This filesystem does not permit directory symlink creation');
      return;
    }
    assert.throws(
      () => loadPromptRuns({ prompts, runsRoot: root, policy: 'review' }),
      /symbolic links are forbidden/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function decodeHtmlText(value) {
  const named = new Map([
    ['amp', '&'],
    ['lt', '<'],
    ['gt', '>'],
    ['quot', '"'],
    ['apos', "'"],
  ]);
  return value.replace(
    /&(?:#(\d+)|#x([a-f0-9]+)|([a-z]+));/giu,
    (match, decimal, hexadecimal, name) => {
      if (decimal) return String.fromCodePoint(Number(decimal));
      if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      return named.get(name) ?? match;
    },
  );
}

test('post-review Astro HTML contains 100 usable trials and byte-exact templates', () => {
  const html = readFileSync(
    resolve(repositoryRoot, 'website/.test-dist/prompts/index.html'),
    'utf8',
  );
  const buttonTags =
    html.match(/<button\b[^>]*\bdata-trial-run\b[^>]*>/gu) ?? [];
  const templateMatches = [
    ...html.matchAll(
      /<template\b[^>]*\bdata-trial-preview\b[^>]*>([\s\S]*?)<\/template>/gu,
    ),
  ];

  assert.equal(buttonTags.length, 100);
  assert.ok(buttonTags.every((tag) => !/\bdisabled\b/u.test(tag)));
  assert.equal(templateMatches.length, 100);

  const expectedOutputs = prompts.map((prompt) => reviewRuns.get(prompt.id).output);
  const embeddedOutputs = templateMatches.map((match) =>
    decodeHtmlText(match[1]),
  );
  assert.deepEqual(embeddedOutputs, expectedOutputs);
  assert.ok(embeddedOutputs.every((output) => output.endsWith('\n')));
});

test('trial dialog exposes result text only and streams through textContent', () => {
  const html = readFileSync(
    resolve(repositoryRoot, 'website/.test-dist/prompts/index.html'),
    'utf8',
  );
  const dialogStart = html.indexOf('<div id="trial-modal"');
  const scriptStart = html.indexOf('<script', dialogStart);
  assert.ok(dialogStart >= 0 && scriptStart > dialogStart);
  const dialog = html.slice(dialogStart, scriptStart);

  for (const forbidden of [
    'GPT-5.6',
    'runner',
    'input_mode',
    'outcome',
    'SHA-256',
    'limitations',
    '执行时间',
    '运行者',
    '查看静态证据',
    '原始 ChatGPT',
  ]) {
    assert.ok(!dialog.includes(forbidden), `dialog leaked ${forbidden}`);
  }

  assert.match(html, /trialText = template\.content\.textContent;/u);
  assert.doesNotMatch(html, /template\.content\.textContent\.trim/u);
  assert.match(html, /trialOutput\.textContent = trialText;/u);
  assert.match(html, /event\.key === 'Escape'/u);
  assert.match(html, /prefers-reduced-motion: reduce/u);
});
