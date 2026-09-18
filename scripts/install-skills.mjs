#!/usr/bin/env node
/**
 * install-skills.mjs — installs/updates the agent skills used by this project.
 *
 *   ponytail    (lazy senior dev mode)      https://github.com/DietrichGebert/ponytail
 *   impeccable  (frontend design craft)     https://github.com/pbakaus/impeccable
 *
 * Run:  node scripts/install-skills.mjs          # install or update
 *       node scripts/install-skills.mjs --check  # print what is installed
 *
 * Sources are cloned shallowly into .cache/skill-src (gitignored, not part of
 * the project). Re-run this script to pull skill updates.
 */

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, '.cache', 'skill-src');

const SOURCES = {
  ponytail: {
    repo: 'https://github.com/DietrichGebert/ponytail.git',
    sparse: ['skills', 'commands'],
  },
  impeccable: {
    repo: 'https://github.com/pbakaus/impeccable.git',
    sparse: ['.claude/skills/impeccable', '.claude/agents', '.agents/skills/impeccable'],
  },
};

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: 'pipe', ...opts }).toString().trim();

function fetchSource(name) {
  const { repo, sparse } = SOURCES[name];
  const dir = join(CACHE, name);
  mkdirSync(CACHE, { recursive: true });

  if (existsSync(join(dir, '.git'))) {
    process.stdout.write(`  updating ${name} … `);
    run('git', ['-C', dir, 'fetch', '--depth', '1', 'origin', 'HEAD'], { cwd: dir });
    run('git', ['-C', dir, 'reset', '--hard', 'FETCH_HEAD'], { cwd: dir });
  } else {
    process.stdout.write(`  cloning ${name} … `);
    rmSync(dir, { recursive: true, force: true });
    try {
      run('git', ['clone', '--depth', '1', '--filter=blob:none', '--sparse', repo, dir]);
      run('git', ['-C', dir, 'sparse-checkout', 'set', ...sparse]);
    } catch {
      // no sparse/blobless support — plain shallow clone
      rmSync(dir, { recursive: true, force: true });
      run('git', ['clone', '--depth', '1', repo, dir]);
    }
  }

  const sha = run('git', ['-C', dir, 'rev-parse', '--short', 'HEAD']);
  console.log(sha);
  return { dir, sha };
}

function copyDir(from, to) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, dereference: false });
}

/** ponytail ships commands as .toml; Claude Code wants .md with frontmatter. */
function installPonytailCommands(srcDir) {
  const src = join(srcDir, 'commands');
  const out = join(ROOT, '.claude', 'commands');
  mkdirSync(out, { recursive: true });
  const written = [];
  for (const file of readdirSync(src).filter((f) => f.endsWith('.toml'))) {
    const raw = readFileSync(join(src, file), 'utf8');
    const description = (raw.match(/^description\s*=\s*(.+)$/m) || [, ''])[1].replace(/^["']|["']$/g, '');
    const prompt = (raw.match(/^prompt\s*=\s*(.+)$/m) || [, ''])[1].replace(/^["']|["']$/g, '');
    const name = file.replace(/\.toml$/, '');
    const body = `---
description: ${JSON.stringify(description)}
argument-hint: "[lite|full|ultra]"
---

${prompt.replace(/\{\{args\}\}/g, '$ARGUMENTS')}${
      name === 'ponytail'
        ? '\n\nLevels: `lite` = build what is asked, name the lazier alternative. `full` = enforce the ladder (default). `ultra` = YAGNI extremist, deletion before addition. `off` = normal mode.'
        : ''
    }
`;
    writeFileSync(join(out, `${name}.md`), body);
    written.push(`/ ${name}`);
  }
  return written;
}

function check() {
  const manifest = join(ROOT, '.claude', 'skills', 'installed-skills.json');
  if (!existsSync(manifest)) {
    console.log('No skills installed. Run: node scripts/install-skills.mjs');
    return;
  }
  console.log(readFileSync(manifest, 'utf8'));
}

function main() {
  if (process.argv.includes('--check')) return check();

  console.log('Installing agent skills…');
  const ponytail = fetchSource('ponytail');
  const impeccable = fetchSource('impeccable');

  // ponytail skills -> .claude/skills (Claude Code) + .agents/skills (Codex & friends)
  const ponytailSkills = readdirSync(join(ponytail.dir, 'skills')).filter((d) =>
    statSync(join(ponytail.dir, 'skills', d)).isDirectory(),
  );
  for (const skill of ponytailSkills) {
    const from = join(ponytail.dir, 'skills', skill);
    copyDir(from, join(ROOT, '.claude', 'skills', skill));
    copyDir(from, join(ROOT, '.agents', 'skills', skill));
  }
  const commands = installPonytailCommands(ponytail.dir);

  // impeccable skill (SKILL.md + reference/ + launcher scripts)
  copyDir(join(impeccable.dir, '.claude/skills/impeccable'), join(ROOT, '.claude', 'skills', 'impeccable'));
  copyDir(join(impeccable.dir, '.agents/skills/impeccable'), join(ROOT, '.agents', 'skills', 'impeccable'));
  copyDir(join(impeccable.dir, '.claude/agents'), join(ROOT, '.claude', 'agents'));

  const manifest = {
    installedAt: new Date().toISOString(),
    skills: {
      ponytail: { version: 'plugin', commit: ponytail.sha, source: SOURCES.ponytail.repo },
      impeccable: { version: 'skill', commit: impeccable.sha, source: SOURCES.impeccable.repo },
    },
  };
  mkdirSync(join(ROOT, '.claude', 'skills'), { recursive: true });
  writeFileSync(join(ROOT, '.claude', 'skills', 'installed-skills.json'), JSON.stringify(manifest, null, 2) + '\n');

  console.log('\nInstalled:');
  console.log(`  ponytail   ${ponytailSkills.length} skills: ${ponytailSkills.join(', ')}`);
  console.log(`  impeccable 1 skill  (24 commands, engine binary downloads on first run)`);
  console.log(`  commands   ${commands.join('  ')}`);
  console.log('\nLocations: .claude/skills/  .claude/commands/  .claude/agents/  .agents/skills/');
}

main();
