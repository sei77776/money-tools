# 開発部門 (Developers)

**この会社の中核部門。** コードに触る仕事はすべてここを通る。

## 役割

仕様の発見からリリースまで。要件の掘り下げ、設計、実装、テスト、デバッグ、
コードレビュー、ブランチの整理。他部門の成果物（デザイン、コピー）を
動くソフトウェアに落とす最終地点でもある。

## デフォルトの進め方

Superpowers のワークフローが既定。飛ばすのは、ユーザーが明示的に
「調べるだけ」「1行直すだけ」と言ったときに限る。

```
brainstorming        意図と要件を対話で引き出す。実装前に必ず。
      ↓
writing-plans        複数ステップの作業は先に計画を書く。
      ↓
executing-plans /    計画を実行する。独立タスクが多いなら
subagent-driven-development / dispatching-parallel-agents で並列化。
      ↓
test-driven-development   テストが先。赤を見てから実装する。
      ↓
requesting-code-review → receiving-code-review
      ↓
verification-before-completion   ← 完了宣言の前に必ず。
```

## 優先スキル

| 場面 | スキル |
|------|--------|
| 何を作るかまだ曖昧 | `brainstorming` |
| 複数ステップの作業 | `writing-plans` → `executing-plans` |
| 実装・バグ修正 | `test-driven-development` |
| バグ・テスト失敗・謎の挙動 | `systematic-debugging` |
| ライブラリの API / 設定 / バージョン | `find-docs`（Context7・**記憶で答えない**） |
| Context7 の MCP / CLI 設定 | `context7-mcp`, `context7-cli` |
| レビューを頼む / 受ける | `requesting-code-review`, `receiving-code-review` |
| 並列で進めたい | `dispatching-parallel-agents`, `subagent-driven-development` |
| 作業を隔離したい | `using-git-worktrees` |
| ブランチを畳む | `finishing-a-development-branch` |
| Web アプリの実挙動確認 | `webapp-testing` |
| 新しいスキルを作る | `writing-skills`, `skill-creator` |
| MCP サーバーを作る | `mcp-builder` |
| スキルの探し方が分からない | `using-superpowers` |

## このリポジトリ固有: Expo（`SuimaruExpo/`）

主実装は `SuimaruExpo/`（**Expo SDK 52 / React Navigation v7 / TypeScript**）。
`SuimaruApp/` は SwiftUI 版で Mac が要る。README の運用方針は
「Windows + iPhone で開発・公開」なので、iOS ビルドは EAS 経由になる。

| 場面 | スキル |
|------|--------|
| SDK のアップグレード・依存関係の破損 | `expo-upgrade` |
| 開発ビルド（Expo Go で動かない機能の検証） | `expo-dev-client` |
| App Store / TestFlight への提出、eas.json | `eas-app-stores` |
| EAS の CI/CD ワークフロー | `eas-workflows` |

注意点:

- **ナビゲーションは React Navigation。expo-router ではない。**
  Expo 公式ドキュメントの多くは expo-router 前提なので、そのまま適用しない。
  この理由で `expo-router` / `expo-project-structure` スキルは意図的に入れていない。
- `expo-notifications` / `expo-media-library` / `expo-image-picker` を使うため、
  Expo Go だけでは検証しきれない場面がある。`expo-dev-client` を先に読む。
- SDK 52 は現行より数世代古い。バージョン依存の挙動は記憶で答えず
  `find-docs`（Context7）で確認する。

## 他部門との連携

- **← Designers**: UI を含む実装では、コードを書く前に `ui-ux-pro-max` で
  スタイル・配色・UX ガイドラインを引く。実装後は Designers の観点で見直す。
- **← Marketing**: 画面内のコピーは自分で書かず、`copywriting` に回す。
- **→ Legal**: ユーザーデータの収集・保存・外部送信を追加したら、
  `privacy-policy` の棚卸しが要る。依存関係を追加したら `ip-trademark` の
  OSS ライセンス確認（特に AGPL）。
- **→ Finance**: 課金・価格ロジックの変更は Finance の確認対象。

## この部門の譲れない一線

1. **テストなしで「動きます」と言わない。** 実行して出力を見る。
2. **原因を特定する前に修正を提案しない。** 推測での修正は `systematic-debugging` 違反。
3. **ライブラリの詳細を記憶から答えない。** `find-docs` で確認する。
4. **依頼された範囲を超えて書き換えない。** 気づいた問題は報告する。
