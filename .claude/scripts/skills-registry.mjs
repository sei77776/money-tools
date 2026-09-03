#!/usr/bin/env node
// Validates every .claude/skills/*/SKILL.md and regenerates .claude/SKILL-REGISTRY.md.
//   node .claude/scripts/skills-registry.mjs          → validate + rewrite the registry
//   node .claude/scripts/skills-registry.mjs --check  → validate only, non-zero exit on failure
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS = join(ROOT, 'skills')
const checkOnly = process.argv.includes('--check')

// Department ownership. A skill absent here is reported as unassigned.
const DEPARTMENTS = {
  developers: {
    label: '開発部門 (Developers)',
    skills: [
      'using-superpowers', 'brainstorming', 'writing-plans', 'executing-plans',
      'test-driven-development', 'systematic-debugging', 'requesting-code-review',
      'receiving-code-review', 'subagent-driven-development', 'dispatching-parallel-agents',
      'using-git-worktrees', 'finishing-a-development-branch', 'verification-before-completion',
      'writing-skills', 'find-docs', 'context7-mcp', 'context7-cli', 'webapp-testing',
      'expo-upgrade', 'expo-dev-client', 'eas-app-stores', 'eas-workflows',
    ],
  },
  designers: {
    label: 'デザイン部門 (Designers)',
    skills: [
      'ui-ux-pro-max', 'ui-styling', 'design-system', 'design', 'brand',
      'banner-design', 'slides', 'frontend-design', 'consulting-pptx-skill',
    ],
  },
  marketing: {
    label: 'マーケティング部門 (Marketing)',
    skills: [
      'marketing-plan', 'product-marketing', 'marketing-ideas', 'copywriting', 'copy-editing',
      'content-strategy', 'seo-audit', 'ai-seo', 'schema', 'programmatic-seo', 'cro',
      'signup', 'onboarding', 'popups', 'paywalls', 'lead-magnets', 'free-tools',
      'emails', 'cold-email', 'pricing', 'offers', 'sales-enablement', 'competitors', 'launch',
    ],
  },
  'social-media': {
    label: 'ソーシャルメディア部門 (Social Media)',
    skills: [
      'voice-builder', 'newsletter-voice', 'post-writer', 'post-formatter', 'post-scorer',
      'hook-generator', 'content-matrix', 'reels-scripting', 'youtube-thumbnail',
      'profile-optimizer',
    ],
  },
  finance: {
    label: '財務部門 (Finance)',
    skills: [
      'bookkeeping-setup', 'financial-statements', 'bank-reconciliation', 'month-end-close',
      'tax-filing-prep', 'cash-runway-forecast', 'unit-economics', 'budget-variance',
      'expense-audit', 'ar-collections',
    ],
  },
  'small-business': {
    label: '中小企業運営部門 (Small Business)',
    skills: [
      'business-plan', 'cash-flow-management', 'pricing-and-margin', 'proposal-writing',
      'invoicing-and-quotes', 'client-onboarding', 'project-management',
      'capacity-and-utilization', 'payroll-run', 'hiring-and-onboarding', 'sop-writer',
      'meeting-notes', 'vendor-management', 'inventory-management',
      'customer-support-playbook', 'kpi-dashboard', 'secretary',
    ],
  },
  legal: {
    label: '法務部門 (Legal)',
    skills: [
      'contract-review', 'vendor-msa-review', 'nda-drafting', 'terms-of-service',
      'privacy-policy', 'employment-agreement', 'ip-trademark', 'compliance-checklist',
      'legal-risk-triage',
    ],
  },
}

function parseFrontmatter(text, dir) {
  const errors = []
  if (!text.startsWith('---\n')) {
    errors.push('SKILL.md does not begin with a YAML frontmatter block')
    return { errors }
  }
  const end = text.indexOf('\n---', 4)
  if (end === -1) {
    errors.push('frontmatter block is not terminated')
    return { errors }
  }
  const block = text.slice(4, end)

  // Minimal YAML: top-level `key: value`, with folded (>-, >) and literal (|) scalars.
  const fields = {}
  const lines = block.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = /^([A-Za-z_][\w-]*):[ \t]*(.*)$/.exec(lines[i])
    if (!m) continue
    let [, key, value] = m
    if (value === '' || value === '>' || value === '>-' || value === '|' || value === '|-') {
      const parts = []
      while (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1] === '')) {
        parts.push(lines[++i].trim())
      }
      value = parts.join(' ').trim()
    }
    value = value.replace(/^["'](.*)["']$/s, '$1').trim()
    if (value) fields[key] = value
  }

  if (!fields.name) errors.push('frontmatter is missing `name`')
  else if (fields.name !== dir) errors.push(`frontmatter name "${fields.name}" != directory "${dir}"`)
  if (!fields.description) errors.push('frontmatter is missing `description`')
  else if (fields.description.length < 40) errors.push('description is too short to trigger reliably (<40 chars)')
  return { fields, errors }
}

const dirs = readdirSync(SKILLS).filter((d) => statSync(join(SKILLS, d)).isDirectory()).sort()
const skills = new Map()
const problems = []

for (const d of dirs) {
  let text
  try {
    text = readFileSync(join(SKILLS, d, 'SKILL.md'), 'utf8')
  } catch {
    problems.push(`${d}: no SKILL.md`)
    continue
  }
  const { fields, errors } = parseFrontmatter(text, d)
  errors.forEach((e) => problems.push(`${d}: ${e}`))
  if (fields?.name) skills.set(d, fields)
}

const owned = new Set(Object.values(DEPARTMENTS).flatMap((x) => x.skills))
for (const d of dirs) if (!owned.has(d)) problems.push(`${d}: not assigned to any department`)
for (const [dept, { skills: list }] of Object.entries(DEPARTMENTS))
  for (const s of list) if (!skills.has(s)) problems.push(`${dept}: lists "${s}", which does not exist`)

// Duplicate descriptions cause ambiguous triggering.
const byDesc = new Map()
for (const [d, f] of skills) {
  const k = f.description.slice(0, 120)
  if (byDesc.has(k)) problems.push(`${d}: description overlaps with ${byDesc.get(k)}`)
  else byDesc.set(k, d)
}

// Cross-references. Curating a subset of an upstream repo leaves "see <skill>"
// pointers at skills that were never imported, which misroutes the model.
const PROSE = new Set([
  'below', 'this', 'usage', 'above', 'anthropic-best-practices', 'channel-specific',
])
const BUILTIN = new Set([
  'dataviz', 'docx', 'xlsx', 'pptx', 'pdf', 'skill-creator', 'mcp-builder',
  'brand-guidelines', 'theme-factory', 'web-artifacts-builder', 'canvas-design',
])
// Upstream skills we deliberately did not vendor. Recorded here with the reason
// so the omission stays a decision rather than decaying into an oversight.
const INTENTIONALLY_OMITTED = {
  social: 'description collides head-on with the Social Media department (post-writer, hook-generator, reels-scripting)',
  'eas-hosting': 'deploys Expo websites and API routes; this repo ships a mobile app only',
  'expo-router': 'SuimaruExpo uses React Navigation — importing it would push an unrequested migration',
  'expo-project-structure': 'new Expo projects only, and assumes Expo Router',
}
for (const d of dirs) {
  let text
  try { text = readFileSync(join(SKILLS, d, 'SKILL.md'), 'utf8') } catch { continue }
  const refs = [
    ...text.matchAll(/see `?([a-z][a-z0-9-]{2,})`?[.,)]/g),
    ...text.matchAll(/use the `?([a-z][a-z0-9-]{2,})`? skill/g),
  ]
  for (const m of refs) {
    const ref = m[1]
    if (skills.has(ref) || PROSE.has(ref) || BUILTIN.has(ref) || ref in INTENTIONALLY_OMITTED) continue
    problems.push(`${d}: references skill "${ref}", which is not installed`)
  }
}

if (problems.length) {
  console.error(`FAIL — ${problems.length} problem(s):`)
  problems.forEach((p) => console.error('  - ' + p))
} else {
  console.log(`PASS — ${skills.size} skills, ${Object.keys(DEPARTMENTS).length} departments, no problems`)
}

if (!checkOnly) {
  const trim = (s) => (s.length > 260 ? s.slice(0, 257).trimEnd() + '…' : s)
  let out = `# スキル台帳 (Skill Registry)

自動生成: \`node .claude/scripts/skills-registry.mjs\`
実体は \`.claude/skills/<名前>/SKILL.md\`。構成の理由は \`.claude/departments/README.md\`。

**合計 ${owned.size} スキル / ${Object.keys(DEPARTMENTS).length} 部門**

| 部門 | スキル数 |
|------|---------:|
`
    for (const [k, v] of Object.entries(DEPARTMENTS)) out += `| ${v.label} | ${v.skills.length} |\n`
    out += `| **合計** | **${owned.size}** |\n`

  for (const [, { label, skills: list }] of Object.entries(DEPARTMENTS)) {
    out += `\n---\n\n## ${label}\n\n| スキル | 用途 |\n|--------|------|\n`
    for (const s of list) {
      const f = skills.get(s)
      if (!f) continue
      out += `| \`${s}\` | ${trim(f.description).replace(/\|/g, '\\|').replace(/\n/g, ' ')} |\n`
    }
  }
  out += `\n---\n\n組み込みスキル（\`docx\` / \`xlsx\` / \`pptx\` / \`pdf\` / \`dataviz\` / \`skill-creator\` /\n\`mcp-builder\` / \`brand-guidelines\` / \`theme-factory\` / \`web-artifacts-builder\` など）は\nClaude Code 本体が提供するため、このリポジトリには取り込んでいない。\n各部門の憲章から参照している。\n`
  writeFileSync(join(ROOT, 'SKILL-REGISTRY.md'), out)
  console.log('wrote .claude/SKILL-REGISTRY.md')
}

process.exit(problems.length ? 1 : 0)
