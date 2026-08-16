import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPOSITORY_BLOB_ROOT =
  'https://github.com/staruhub/awesome-workbuddy/blob/main/';
const PROMPT_SOURCE_PATH = './prompts/100-work-efficiency-prompts.json';
const PROMPT_SOURCE_URL = new URL(
  PROMPT_SOURCE_PATH.slice(2),
  REPOSITORY_BLOB_ROOT,
).href;

export const RESOURCE_SECTIONS = Object.freeze([
  { heading: 'Official Resources 官方资源', key: 'official', en: 'Official Resources', zh: '官方资源' },
  { heading: 'Official Updates 官方更新动态', key: 'updates', en: 'Official Updates', zh: '官方更新动态' },
  { heading: 'Skills & Plugins 技能与插件', key: 'skills', en: 'Skills & Plugins', zh: '技能与插件' },
  { heading: 'Prompts & Workflows 提示词与工作流', key: 'prompts', en: 'Prompts & Workflows', zh: '提示词与工作流' },
  { heading: 'Tutorials & Guides 教程与上手指南', key: 'tutorials', en: 'Tutorials & Guides', zh: '教程与上手指南' },
  { heading: 'Deep Dives & Reviews 深度拆解与评测', key: 'reviews', en: 'Deep Dives & Reviews', zh: '深度拆解与评测' },
  { heading: 'Comparisons 对比测评', key: 'compare', en: 'Comparisons', zh: '对比测评' },
  { heading: 'Integrations 生态集成', key: 'integrations', en: 'Integrations', zh: '生态集成' },
  { heading: 'Community 社区与讨论', key: 'community', en: 'Community', zh: '社区与讨论' },
  { heading: 'Related Awesome Lists 相关列表', key: 'related', en: 'Related Awesome Lists', zh: '相关列表' },
]);

const EXPECTED_H2_SEQUENCE = Object.freeze([
  'Contents',
  ...RESOURCE_SECTIONS.map((section) => section.heading),
  'Contributing',
]);

function fail(message) {
  throw new Error(`README catalog validation failed: ${message}`);
}

function normalizeUrlKey(rawUrl) {
  if (rawUrl.startsWith('./')) {
    if (rawUrl.includes('\\') || rawUrl.split('/').includes('..')) {
      fail(`unsafe relative URL "${rawUrl}"`);
    }
    return `repo:${rawUrl.slice(2)}`;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    fail(`invalid URL "${rawUrl}"`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    fail(`unsupported URL protocol in "${rawUrl}"`);
  }
  parsed.hash = '';
  return parsed.href;
}

function parseEntry(line, lineNumber) {
  const match = line.match(/^- \[([^\]]*)\]\(([^)]*)\) -[ \t]*(.*)$/u);
  if (!match) {
    fail(`malformed entry at line ${lineNumber}: "${line}"`);
  }

  const [, rawTitle, rawUrl, rawDescription] = match;
  const title = rawTitle.trim();
  const url = rawUrl.trim();
  const description = rawDescription.trim();

  if (!title) fail(`empty title at line ${lineNumber}`);
  if (!url || /\s/u.test(url)) fail(`invalid URL at line ${lineNumber}`);
  if (!description) fail(`empty description at line ${lineNumber}`);

  return { title, url, description, urlKey: normalizeUrlKey(url) };
}

export function parseReadmeCatalog(markdown) {
  if (typeof markdown !== 'string' || !markdown.trim()) {
    fail('README input must be a non-empty string');
  }

  const lines = markdown.replace(/\r\n?/gu, '\n').split('\n');
  const h2s = [];
  lines.forEach((line, index) => {
    const match = line.match(/^## (.+)$/u);
    if (match) h2s.push({ heading: match[1].trim(), index });
  });

  const actualSequence = h2s.map(({ heading }) => heading);
  if (
    actualSequence.length !== EXPECTED_H2_SEQUENCE.length ||
    actualSequence.some((heading, index) => heading !== EXPECTED_H2_SEQUENCE[index])
  ) {
    fail(
      `unknown, missing, or reordered H2 headings; expected ${JSON.stringify(EXPECTED_H2_SEQUENCE)}, received ${JSON.stringify(actualSequence)}`,
    );
  }

  const seenUrls = new Map();
  let sourceBulletCount = 0;
  const categories = RESOURCE_SECTIONS.map((section) => {
    const headingIndex = h2s.findIndex(({ heading }) => heading === section.heading);
    const start = h2s[headingIndex].index + 1;
    const end = h2s[headingIndex + 1].index;
    const sectionLines = lines
      .slice(start, end)
      .map((line, offset) => ({ text: line, lineNumber: start + offset + 1 }))
      .filter(({ text }) => text.trim() !== '');

    if (sectionLines.length === 0) fail(`section "${section.heading}" is empty`);
    sourceBulletCount += sectionLines.filter(({ text }) => text.startsWith('- ')).length;

    const items = sectionLines.map(({ text, lineNumber }) => {
      const entry = parseEntry(text, lineNumber);
      const firstLine = seenUrls.get(entry.urlKey);
      if (firstLine) {
        fail(`duplicate URL "${entry.url}" at lines ${firstLine} and ${lineNumber}`);
      }
      seenUrls.set(entry.urlKey, lineNumber);
      return {
        title: entry.title,
        url: entry.url,
        description: entry.description,
      };
    });

    return { ...section, items };
  });

  const total = categories.reduce((sum, category) => sum + category.items.length, 0);
  const categorySubtotal = categories.reduce((sum, category) => sum + category.items.length, 0);
  if (total !== sourceBulletCount || total !== categorySubtotal) {
    fail(
      `count drift: ${sourceBulletCount} source bullets, ${categorySubtotal} category entries, ${total} total entries`,
    );
  }

  return { categories, total };
}

export function loadReadmeCatalog(
  readmePath = resolve(process.cwd(), '../README.md'),
) {
  let markdown;
  try {
    markdown = readFileSync(readmePath, 'utf8');
  } catch (error) {
    fail(`could not read README: ${error.message}`);
  }
  return parseReadmeCatalog(markdown);
}

export function withBase(base, path = '/') {
  const normalizedBase = `/${String(base).replace(/^\/+|\/+$/gu, '')}`;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase === '/' ? '' : normalizedBase}${normalizedPath}`;
}

export function resolveCatalogUrl(rawUrl, base) {
  if (rawUrl === PROMPT_SOURCE_PATH || rawUrl === PROMPT_SOURCE_URL) {
    return {
      href: withBase(base, '/prompts/'),
      external: false,
      host: '本站 Prompt 库',
    };
  }

  if (rawUrl.startsWith('./')) {
    normalizeUrlKey(rawUrl);
    return {
      href: new URL(rawUrl.slice(2), REPOSITORY_BLOB_ROOT).href,
      external: true,
      host: 'github.com',
    };
  }

  normalizeUrlKey(rawUrl);
  return {
    href: rawUrl,
    external: true,
    host: new URL(rawUrl).hostname.replace(/^www\./u, ''),
  };
}
