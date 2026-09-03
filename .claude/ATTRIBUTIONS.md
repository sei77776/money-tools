# 取り込み元とライセンス

全 101 スキルの内訳:

| 区分 | 件数 |
|------|-----:|
| 外部リポジトリから取り込み（vendored、すべて MIT） | 65 |
| 本リポジトリで新規作成 | 35 |
| 元からあったもの（`secretary`） | 1 |

新規作成分は frontmatter に `metadata.department` を持つため、
`grep -rl "^  department:" .claude/skills/*/SKILL.md` で機械的に区別できる。

取り込みは 2026-07-26 時点、`git clone --depth 1` による。

---

## 1. Superpowers — 14 スキル

- リポジトリ: https://github.com/obra/superpowers
- コミット: `3dcbd5c`
- ライセンス: MIT — Copyright (c) 2025 Jesse Vincent

`using-superpowers`, `brainstorming`, `writing-plans`, `executing-plans`,
`test-driven-development`, `systematic-debugging`, `requesting-code-review`,
`receiving-code-review`, `subagent-driven-development`, `dispatching-parallel-agents`,
`using-git-worktrees`, `finishing-a-development-branch`, `verification-before-completion`,
`writing-skills`

> 公式の推奨インストール方法は Claude Code CLI 内の
> `/plugin marketplace add obra/superpowers-marketplace` → `/plugin install superpowers@superpowers-marketplace`。
> 本セッションは非対話の remote 実行環境でありスラッシュコマンドを実行できないこと、
> かつプラグインの導入先 `~/.claude/` がコンテナ破棄で消えることから、
> **リポジトリ内に vendoring する方式を選んだ**。この方式なら git 管理下に残り、
> Web / モバイル / ローカル CLI のどこから開いても同じ構成が再現される。

## 2. Context7 — 3 スキル

- リポジトリ: https://github.com/upstash/context7
- コミット: `b250c25`
- ライセンス: MIT — Copyright (c) 2021 Upstash, Inc.

`find-docs`, `context7-mcp`, `context7-cli`

当初はリポジトリ直下に `.mcp.json` を置いたが、**削除した**。
claude.ai のコネクタとして Context7 が有効な環境では、リポジトリ側の設定が
2 つ目のサーバーとして登録され、そちらが毎セッション認証に失敗するため。
コネクタ経由の動作は `resolve-library-id` で確認済み。
コネクタを使わない場合の設定方法は README に記載した。
**API キーをコミットしないこと。**

## 3. UI/UX Pro Max — 7 スキル

- リポジトリ: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- コミット: `1307d97`
- ライセンス: MIT — Copyright (c) 2024 Next Level Builder

`ui-ux-pro-max`, `ui-styling`, `design-system`, `design`, `brand`, `banner-design`, `slides`

**改変あり**: `ui-styling/canvas-fonts/`（TTF 約 5.5MB）を除外した。
canvas ベースの画像生成でフォント埋め込みが必要になった場合は、上流から取得する:

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uupm
cp -r /tmp/uupm/.claude/skills/ui-styling/canvas-fonts .claude/skills/ui-styling/
```

## 4. Marketing Skills — 24 スキル（上流は 48 スキル）

- リポジトリ: https://github.com/coreyhaines31/marketingskills
- コミット: `c21a984`
- ライセンス: MIT — Copyright (c) 2025 Corey Haines

`marketing-plan`, `product-marketing`, `marketing-ideas`, `copywriting`, `copy-editing`,
`content-strategy`, `seo-audit`, `ai-seo`, `schema`, `programmatic-seo`, `cro`,
`signup`, `onboarding`, `popups`, `paywalls`, `lead-magnets`, `free-tools`,
`emails`, `cold-email`, `pricing`, `offers`, `sales-enablement`, `competitors`, `launch`

当初はコア 12 件のみ取り込んだが、**取り込んだスキルの本文が未取り込みスキルを
「see X」で参照しており、参照切れが 12 件発生していた**（例: `marketing-plan` は
`product-marketing` が生成する `.agents/product-marketing.md` を読む前提で書かれている）。
参照先が存在しないとモデルの誘導先が壊れるため、参照されていた 12 件を追加した。
この検査は `.claude/scripts/skills-registry.mjs` に組み込んであり、
以後キュレーションを変えても参照切れは検出される。

**改変あり**: `content-strategy/SKILL.md` の description 末尾
「For social media content specifically, see social.」を、Social Media 部門への
引き渡しに書き換えた。上流の `social` スキルは description が
`post-writer` / `hook-generator` / `reels-scripting` と正面衝突する
（"LinkedIn post", "what should I post", "Reels" などを両方が主張する）ため
**意図的に取り込んでいない**。

未取り込みの 24 件（`ads`, `ad-creative`, `analytics`, `aso`, `churn-prevention`,
`co-marketing`, `community-marketing`, `competitor-profiling`, `customer-research`,
`directory-submissions`, `image`, `influencer-marketing`, `marketing-council`,
`marketing-loops`, `marketing-psychology`, `prospecting`, `public-relations`,
`referrals`, `revops`, `site-architecture`, `sms`, `social`, `video`, `ab-testing`）は
必要になった時点で上記リポジトリから追加できる。

## 5. Social Media Skills — 10 スキル（上流は 17 スキル）

- リポジトリ: https://github.com/charlie947/social-media-skills
- コミット: `94f72ea`
- ライセンス: MIT — Copyright (c) 2026 Charlie Hills

`voice-builder`, `newsletter-voice`, `post-writer`, `post-formatter`, `post-scorer`,
`hook-generator`, `content-matrix`, `reels-scripting`, `youtube-thumbnail`, `profile-optimizer`

未取り込み: `analytics-dashboard`, `gemini-carousel`, `gemini-infographic`,
`graphic-designer`, `niche-research`, `pinned-comment`, `quote-post`

**外部 API 依存**: `reels-scripting` は `APIFY_API_TOKEN` と `GOOGLE_AI_API_KEY`、
`post-scorer` は `APIFY_API_TOKEN` を要求する。未設定でも他スキルの動作には影響しない。

## 6. Expo Skills — 4 スキル（上流は 23 スキル）

- リポジトリ: https://github.com/expo/skills
- コミット: `09eb052`
- ライセンス: MIT — Copyright (c) 2025-present 650 Industries, Inc. (aka Expo)

`expo-upgrade`, `expo-dev-client`, `eas-app-stores`, `eas-workflows`

このリポジトリの主実装 `SuimaruExpo/` が Expo アプリであるため、開発部門に追加した。
選定は推測ではなく `SuimaruExpo/package.json` の実際の依存関係に基づく
（Expo SDK 52 / React Navigation v7 / expo-notifications / expo-media-library /
expo-image-picker）。

**意図的に取り込まなかったもの**（理由は `skills-registry.mjs` の
`INTENTIONALLY_OMITTED` にも記録）:

- `expo-router` — 本プロジェクトは React Navigation を使用。入れると
  依頼されていない移行を促すことになる
- `expo-project-structure` — 「新規プロジェクト専用、既存アプリを作り替えるな」と
  スキル自身が明記しており、かつ expo-router 前提
- `eas-hosting` — Web サイト / API ルートのホスティング用。本リポジトリは
  モバイルアプリのみ

残り 19 件（`expo-ui`, `expo-native-ui`, `expo-dom`, `expo-module`,
`expo-brownfield`, `expo-app-clip`, `expo-data-fetching`, `expo-tailwind-setup`,
`expo-web-to-native`, `expo-examples`, `eas-update-insights`, `eas-observe`,
`eas-simulator` ほか）は必要時に追加できる。

## 7. Anthropic Skills — 2 スキル

- リポジトリ: https://github.com/anthropics/skills
- コミット: `b29e7cf`

`frontend-design`, `webapp-testing`

同リポジトリの他スキル（`skill-creator`, `mcp-builder`, `brand-guidelines`,
`theme-factory`, `web-artifacts-builder`, `canvas-design`, `docx`, `xlsx`, `pptx`,
`pdf` など）は **Claude Code 本体に組み込み済み**のため取り込んでいない。
重複させると同名スキルが二重登録され、どちらが起動したか分からなくなる。

## 8. Consulting PPTX Skill — 1 スキル

- リポジトリ: https://github.com/gozen3ji/consulting-pptx-skill
- コミット: `7c6f27c`
- ライセンス: MIT — Copyright (c) 2026 Carnot AI Inc.

`consulting-pptx-skill`（デザイン部門に配置）

経営会議品質のコンサル資料（PPTX）を作るスキル。約80項目のスライド設計規約
（`references/slide-rules.md`）を核に、自由記述テンプレート、または36型の
SlideSpec パイプライン（JSON → HTML → QA → 編集可能PPTX）でスライドを組み、
`scripts/check_deck.py` の機械チェックで仕上げる。取り込みは 2026-09-03 時点、
上流の全ファイル（`pipeline/`, `references/`, `templates/`, `scripts/`,
`assets/`, `docs/`）をそのまま vendoring した（改変なし）。

---

## 本リポジトリで新規作成したスキル — 35 件

財務・法務・中小企業運営については、要件を満たす公開スキルリポジトリを
見つけられなかったため新規作成した。

- **財務 (10)**: `bookkeeping-setup`, `financial-statements`, `bank-reconciliation`,
  `month-end-close`, `tax-filing-prep`, `cash-runway-forecast`, `unit-economics`,
  `budget-variance`, `expense-audit`, `ar-collections`
- **法務 (9)**: `contract-review`, `vendor-msa-review`, `nda-drafting`, `terms-of-service`,
  `privacy-policy`, `employment-agreement`, `ip-trademark`, `compliance-checklist`, `legal-risk-triage`
- **中小企業運営 (16)**: `business-plan`, `cash-flow-management`, `pricing-and-margin`,
  `proposal-writing`, `invoicing-and-quotes`, `client-onboarding`, `project-management`,
  `capacity-and-utilization`, `payroll-run`, `hiring-and-onboarding`, `sop-writer`,
  `meeting-notes`, `vendor-management`, `inventory-management`,
  `customer-support-playbook`, `kpi-dashboard`

これらは**プロセス（いつ使うか / 何を順に確認するか / 何を検証してから出すか）**
として書かれており、プロンプト集ではない。財務・法務スキルは成果物に
専門家レビュー前提の免責を含めることを要求している。

`secretary` は本リポジトリに元からあったもの（中小企業運営部門に配置）。
