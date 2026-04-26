# Dockerfile マルチステージビルド解説

## 概要

このDockerfileはNext.jsアプリケーション用の**マルチステージビルド**を実装しています。  
イメージサイズを最小化し、セキュリティを高めるための実装です。

---

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────┐
│                    BASE ステージ                               │
│              node:20-alpine (軽量ベースイメージ)               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼─────┐ ┌────▼─────┐ ┌──▼──────────┐
    │    deps   │ │ builder  │ │   runner    │
    └───────────┘ └──────────┘ └─────────────┘
```

---

## 4つのステージ詳細

### 1️⃣ BASE ステージ

```dockerfile
FROM node:20-alpine AS base
```

**役割：** すべてのステージで共有されるベースイメージ

- **Node.js 20** を使用
- **Alpine Linux** を採用（軽量：約170MB）
- 全ステージがこれを継承

---

### 2️⃣ DEPS ステージ（依存関係の準備）

```dockerfile
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
```

**役割：** Node.js 依存関係のインストール

| 行 | 処理 | 説明 |
|---|---|---|
| `apk add --no-cache libc6-compat` | C言語ライブラリ追加 | Node.jsのネイティブモジュール互換性向上 |
| `COPY package.json package-lock.json*` | パッケージファイルコピー | `*` はpackage-lock.jsonが無くても動作 |
| `npm ci` | 依存関係インストール | `npm install` より厳密（CI用） |

**出力：** `node_modules/` ディレクトリ  
**最終イメージに含まれません** ← キャッシュ層として機能

---

### 3️⃣ BUILDER ステージ（アプリケーションビルド）

```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
```

**役割：** Next.jsアプリケーションをビルド

| ステップ | 内容 |
|---|---|
| `COPY --from=deps` | deps ステージから `node_modules` を取得 |
| `COPY . .` | アプリケーションソースコードをコピー |
| `npm run build` | Next.js ビルド実行 |

**生成ファイル：**
- `.next/standalone/` - スタンドアロンサーバーコード
- `.next/static/` - 静的ファイル（JS、CSS）
- `public/` - 公開ファイル

**最終イメージに含まれません** ← 不要なビルドツール削減

---

### 4️⃣ RUNNER ステージ（本番イメージ）

```dockerfile
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
```

#### ステップ1: ファイル準備

```dockerfile
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
```

| 処理 | 目的 |
|---|---|
| builder から `public/` をコピー | 静的ファイルを配置 |
| `.next/` ディレクトリ作成 | プリレンダーキャッシュ用 |
| `--chown=nextjs:nodejs` | ファイルオーナーを非root ユーザーに設定 |

#### ステップ2: セキュリティ強化 🔐

```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
```

**重要な理由：**
- ✅ Dockerコンテナは **root権限で実行されない**
- ✅ セキュリティ侵害時の被害を限定
- ✅ `--system` オプション：システムユーザー（シェルなし）として作成
- ✅ GID/UID を明示：予測可能な権限管理

#### ステップ3: 実行設定

```dockerfile
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

| 設定 | 説明 |
|---|---|
| `USER nextjs` | 以降のコマンドを nextjs ユーザーで実行 |
| `EXPOSE 3000` | ポート 3000 をリッスン（ドキュメント用） |
| `ENV PORT 3000` | アプリケーション用環境変数 |
| `ENV HOSTNAME "0.0.0.0"` | すべてのネットワークインターフェースにバインド |
| `CMD ["node", "server.js"]` | コンテナ起動コマンド |

> **注:** `server.js` は `npm run build` 時に Next.js により自動生成されます  
> 参考：[Next.js Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing)

---

## 📊 イメージサイズ最適化

```
❌ 全てを1つのステージで構築する場合
   └─ イメージサイズ：～1.5GB（ビルドツール、ソースコード含む）

✅ マルチステージビルドを使用
   └─ イメージサイズ：～200-300MB（ビルド済みファイルのみ）
```

**最終イメージに含まれるもの：**
- Node.js 実行環境
- ビルド済みアプリケーション（`.next/standalone`）
- 静的ファイル
- `node_modules` ❌（含まれない）
- ソースコード ❌（含まれない）

---

## 🔑 セキュリティのベストプラクティス

| 施策 | 効果 |
|---|---|
| **非root ユーザー実行** | 権限昇格攻撃を防止 |
| **Alpine Linux** | 攻撃対象を最小化（軽量） |
| **最小限のレイヤー** | 脆弱性の可能性を低減 |
| **ビルドツール除外** | サプライチェーン攻撃リスク低減 |

---

## 🚀 実行フロー

```
1. コンテナ起動
   ↓
2. /app ディレクトリで USER nextjs として実行開始
   ↓
3. node server.js 実行
   ↓
4. ポート 3000 でリッスン
   ↓
5. HOSTNAME 0.0.0.0 ですべてのネットワークインターフェースからアクセス可能
```

---

## 📝 カスタマイズ例

### テレメトリを無効化する場合

```dockerfile
# builder ステージで以下のコメントを解除：
ENV NEXT_TELEMETRY_DISABLED 1

# runner ステージでも同様（ランタイム用）：
ENV NEXT_TELEMETRY_DISABLED 1
```

---

## 関連ドキュメント

- [Next.js Telemetry](https://nextjs.org/telemetry)
- [Next.js Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
