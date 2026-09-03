#!/usr/bin/env node
// Keyword-overlap check between a task phrase and every skill description.
//
// SCOPE: this scores description text only. It does NOT prove which skill the
// model will actually invoke — that depends on the model reading the full
// description in context. Treat a top-ranked match as evidence the description
// is discoverable for that phrasing, and a missing match as a real defect.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILLS = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')

const CASES = [
  { phrase: '新しい機能を追加したい', expect: 'brainstorming',
    terms: ['feature', 'creative work', 'building components', 'adding functionality', 'before implementation', 'requirements'] },
  { phrase: 'この画面のUIを改善して', expect: 'ui-ux-pro-max',
    terms: ['ui', 'ux', 'reviewing ui', 'components', 'layout', 'accessibility', 'design'] },
  { phrase: 'このブログ記事をXとLinkedIn用にリライトして', expect: 'post-writer',
    terms: ['linkedin post', 'write a post', 'draft a post', 'context dump', 'voice'] },
  { phrase: 'この契約書をレビューして', expect: 'contract-review',
    terms: ['契約書レビュー', 'review this contract', 'agreement', 'redline', 'risk'] },
  { phrase: '今月の資金繰りが心配', expect: 'cash-flow-management',
    terms: ['資金繰り', 'cash', 'tight on cash', 'bills', 'payment priority'] },
  { phrase: '損益計算書を作って', expect: 'financial-statements',
    terms: ['損益計算書', 'income statement', 'p&l', 'balance sheet', 'financial statements'] },

  // Boundary cases — skills that sit next to a similarly-named neighbour and
  // could plausibly steal each other's traffic.
  { phrase: '提案書を作りたい', expect: 'proposal-writing',
    terms: ['提案書', 'write a proposal', 'sow', 'statement of work', 'rfp'] },
  { phrase: '新しく契約したクライアントを立ち上げる', expect: 'client-onboarding',
    terms: ['顧客の受け入れ', 'client onboarding', 'we just signed a client', 'kickoff', 'handover to delivery'] },
  { phrase: 'この打ち合わせの議事録を作って', expect: 'meeting-notes',
    terms: ['議事録', 'meeting minutes', 'summarize this call', 'action items from this', 'write up this meeting'] },
  { phrase: '案件が遅れている', expect: 'project-management',
    terms: ['案件管理', "we're behind schedule", 'status report', 'project plan', 'プロジェクトの進捗'] },
  { phrase: '確定申告の準備をしたい', expect: 'tax-filing-prep',
    terms: ['確定申告', '決算準備', 'tax time', 'prepare for my accountant', 'year-end tax'] },
  { phrase: 'ターゲット顧客とポジショニングを整理したい', expect: 'product-marketing',
    terms: ['ideal customer profile', 'icp', 'positioning', 'product context', 'target audience'] },

  // Repo-specific: SuimaruExpo.
  { phrase: 'Expo の SDK を上げたい', expect: 'expo-upgrade',
    terms: ['upgrading expo sdk', 'sdk versions', 'dependency issues'] },
  { phrase: 'App Store に提出したい', expect: 'eas-app-stores',
    terms: ['app store', 'testflight', 'eas submit', 'submit to the ios', 'store listing'] },
]

const descs = new Map()
for (const d of readdirSync(SKILLS)) {
  if (!statSync(join(SKILLS, d)).isDirectory()) continue
  try {
    const t = readFileSync(join(SKILLS, d, 'SKILL.md'), 'utf8')
    const end = t.indexOf('\n---', 4)
    descs.set(d, t.slice(0, end < 0 ? 2000 : end).toLowerCase())
  } catch {}
}

let failures = 0
for (const c of CASES) {
  const scored = [...descs]
    .map(([name, text]) => [name, c.terms.filter((t) => text.includes(t.toLowerCase())).length])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  const rank = scored.findIndex(([n]) => n === c.expect)
  const ok = rank === 0
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${c.phrase}"`)
  console.log(`      expected: ${c.expect}${ok ? '' : `  (ranked #${rank < 0 ? '—' : rank + 1})`}`)
  console.log(`      top 3:    ${scored.slice(0, 3).map(([n, s]) => `${n}(${s})`).join(', ') || '(none)'}`)
}

console.log(`\n${CASES.length - failures}/${CASES.length} routing cases matched on description text.`)
process.exit(failures ? 1 : 0)
