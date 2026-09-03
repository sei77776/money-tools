# Enterprise OS — 全体ルール

このリポジトリは Claude を「部門を持つ会社」として動かすための設定を含む。
7 部門・101 スキルが `.claude/skills/` に配置され、各部門の憲章（役割・優先スキル・
連携ルール）は `.claude/departments/<部門>/CLAUDE.md` にある。

> 補足: `.claude/departments/*/CLAUDE.md` は自動読み込みされない。
> このファイルのルーティング表に従い、**必要になった部門の憲章だけを Read する**。
> 全部門を先読みしない（コンテキストの無駄）。

---

## 1. 受付 — まずどの部門の仕事か決める

タスクを受け取ったら、応答を書く前に所属部門を判定する。判定は宣言不要（ユーザーに
「これは開発部門の仕事です」と報告する必要はない）。ただし内部的には必ず行う。

| 部門 | 判定の目安 | 憲章 |
|------|-----------|------|
| **Developers** | コード、テスト、デバッグ、アーキテクチャ、ライブラリ、リリース | `.claude/departments/developers/CLAUDE.md` |
| **Designers** | UI、画面、レイアウト、配色、タイポグラフィ、ブランド、スライド、バナー | `.claude/departments/designers/CLAUDE.md` |
| **Marketing** | コピー、LP、SEO、価格戦略、ローンチ、メール、リードマグネット、CRO、営業資料、競合比較 | `.claude/departments/marketing/CLAUDE.md` |
| **Social Media** | X / LinkedIn / Instagram / YouTube 投稿、Reels、サムネ、発信の声 | `.claude/departments/social-media/CLAUDE.md` |
| **Finance** | 決算書、記帳、資金繰り、照合、予実、CAC/LTV、経費、確定申告の準備 | `.claude/departments/finance/CLAUDE.md` |
| **Small Business** | 請求、見積、提案書、給与、在庫、採用、SOP、議事録、案件管理、稼働、事業計画、取引先、KPI | `.claude/departments/small-business/CLAUDE.md` |
| **Legal** | 契約書、NDA、規約、プライバシー、商標、コンプライアンス | `.claude/departments/legal/CLAUDE.md` |

判定できないときは推測で進めず、**何をしたいのかを 1 つだけ質問する**。

## 2. スキルは推測せず、必ず起動する

- 該当スキルがあるなら、自前の即席手順で代替しない。Skill ツールで起動する。
- スキル一覧は `.claude/SKILL-REGISTRY.md`。
- 複数該当するときは、より具体的なスキルを優先する
  （例: NDA なら `contract-review` ではなく `nda-drafting`）。
- 該当スキルが存在しないと判断したら、`skill-creator` で骨格を作ることを提案する。

## 3. 部門をまたぐときの順序

1 つのタスクが複数部門にまたがるときは、**Developers → Designers → Marketing →
Social Media** の順で流す。上流の成果物が下流の入力になるため、逆順にすると作り直しになる。

Finance / Legal / Small Business は横断部門で、**上記フローの任意の地点に割り込む**。
特に次は割り込み必須:

- 外部に出す契約・規約・プライバシー文言 → **Legal を必ず通す**
- 価格・原価・利益率が絡む判断 → **Finance を必ず通す**

## 4. 開発のデフォルトフロー（Superpowers）

コードを書く仕事は、明示的に省略を指示されない限りこの流れに従う。

```
Brainstorm → Spec → Plan → TDD → Review → Verify
brainstorming → writing-plans → executing-plans
              → test-driven-development → requesting-code-review
              → verification-before-completion
```

- 新機能・新規コンポーネント・挙動変更の前は **`brainstorming` から始める**。
- 実装前に **`test-driven-development`**。テストを先に書き、赤を確認してから実装する。
- バグ・テスト失敗・想定外の挙動は **`systematic-debugging`**。原因を特定する前に修正を提案しない。
- 外部ライブラリの API・設定・バージョン挙動は **記憶で答えず `find-docs`（Context7）で確認する**。

## 5. 完了と言う前に検証する（Verification Before Completion）

これは全部門に適用される、この OS で最も重要なルール。

**「できました」「修正しました」「動きます」と言う前に、実際に検証コマンドを実行し、
その出力を確認する。** 主張より先に証拠を出す。

- 開発: テスト・ビルド・リント・型チェックを実行し、結果を提示する
- デザイン: 実際にレンダリングして確認する（`webapp-testing` が使える）
- 財務: 貸借一致、合計の突合、元資料との照合
- 法務: 全条項を読んだか、参照先文書も入手したか
- 文章: 事実の裏取り、リンクの生存確認

検証していないなら、**検証していないと言う**。テストが落ちているなら、出力とともに
落ちていると言う。一部しかできていないなら、何ができていないかを明示する。
推測を完了として報告しない。

## 6. 各部門の免責

Finance / Legal の成果物は **専門家のレビュー前提の下書き**であり、
会計・税務・法律の助言ではない。該当スキルはこの免責を出力に含めることを要求している。
省略しない。

## ドキュメント規約（この OS の標準フォーマット）

新しい機能に着手するときは `docs/<機能名>/` に 3 点セットを起票する。
`sei77776/threads-report` で確立された書式を OS 標準として全リポジトリに適用する。

| ファイル | 役割 | 対応するスキル |
|---|---|---|
| `implementation_plan.md` | 何をどう作るか。着手前に書く | `writing-plans` |
| `task.md` | チェックボックス形式の進捗。完了したら `[x]` にする | `executing-plans` |
| `walkthrough.md` | 完成後の動作説明・引き継ぎ | `verification-before-completion` |

書式の参照元: `sei77776/threads-report` の `docs/proposal_generator/`。

## 7. リポジトリ運用

- 作業ブランチ: `claude/*`。`main` に直接コミットしない。
- コンテナは揮発する。**残すものは必ずコミットして push する。**
- 一時ファイルはスクラッチパッドへ。リポジトリを汚さない。
