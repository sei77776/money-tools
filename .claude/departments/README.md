# 組織構造について

## 実際のレイアウト

```
CLAUDE.md                         # 企業OS全体ルール（Claude Code が自動読込）
.mcp.json                         # Context7 MCP サーバー
.claude/
├── SKILL-REGISTRY.md             # 全スキル台帳（部門別）
├── ATTRIBUTIONS.md               # 取り込み元リポジトリとライセンス
├── departments/
│   ├── developers/CLAUDE.md      # 部門憲章（必要時に Read）
│   ├── designers/CLAUDE.md
│   ├── marketing/CLAUDE.md
│   ├── social-media/CLAUDE.md
│   ├── finance/CLAUDE.md
│   ├── small-business/CLAUDE.md
│   └── legal/CLAUDE.md
└── skills/                       # 全スキルをフラットに配置（単一の正）
    ├── brainstorming/SKILL.md
    ├── ui-ux-pro-max/SKILL.md
    └── ... (101 スキル)
```

## なぜ `departments/*/skills/` にスキルを置かないのか

当初の設計案は各部門ディレクトリ配下に `skills/` を持たせるものだったが、
これは動作しない。**Claude Code のスキル探索は `.claude/skills/<名前>/SKILL.md`
という 1 階層のみを走査する。** `.claude/departments/finance/skills/` に置いた
SKILL.md は発見されず、スキルとして起動できない。

回避策として symlink または複製も検討したが、

- **symlink** — Windows のチェックアウトでプレーンテキスト化して壊れる
  （このリポジトリは Windows + iPhone での開発を想定している）
- **複製** — 同名スキルが 2 箇所に存在し、片方だけ更新される事故が起きる

したがって、**スキルの実体は `.claude/skills/` にフラットに 1 箇所だけ置き、
部門は「所属のメタデータ」として表現する**構成にした。

## 部門への所属はどこで表現されているか

3 箇所で二重化している（どれか 1 つを見れば分かる）。

1. **各 SKILL.md の frontmatter** — 自作スキルは `metadata.department` を持つ
2. **`.claude/SKILL-REGISTRY.md`** — 部門ごとの一覧表（自動生成）
3. **各部門の `CLAUDE.md`** — その部門の優先スキル表

外部から取り込んだスキルは frontmatter を書き換えていない
（上流の更新を取り込みやすくするため）。所属は 2. と 3. で表現している。

## ルーティングの流れ

```
ユーザーの依頼
   ↓
CLAUDE.md（自動読込）のルーティング表で部門を判定
   ↓
.claude/departments/<部門>/CLAUDE.md を Read（必要な部門のみ）
   ↓
その部門の優先スキルを Skill ツールで起動
```

部門憲章を @import で自動読込しないのは意図的で、7 部門すべてを常時読み込むと
毎ターン無駄なコンテキストを消費するため。判定に必要な情報は CLAUDE.md の
ルーティング表に集約してある。
