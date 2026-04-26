# Docker化の実装計画

本プロジェクトをDockerコンテナ上で効率的にビルド・実行できるように設定します。Next.jsの「Standalone Output」機能を活用し、軽量で本番環境に適したイメージを作成します。

## 変更内容

### 1. Next.js 設定の変更
#### [MODIFY] [next.config.ts](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/next.config.ts)
*   `output: 'standalone'` を設定に追加します。これにより、ビルド時に必要な `node_modules` のサブセットのみを含む軽量なサーバーが生成されます。

### 2. Docker 関連ファイルの新規作成
#### [NEW] [Dockerfile](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/Dockerfile)
*   以下のマルチステージビルドを実装します：
    1.  **deps**: `package.json` と `package-lock.json` を元に依存関係をインストール。
    2.  **builder**: アプリケーションをビルド。
    3.  **runner**: ビルド済みの `standalone` フォルダと `static`, `public` フォルダのみをコピーして実行。イメージサイズを最小限に抑えます。

#### [NEW] [.dockerignore](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/.dockerignore)
*   `node_modules`, `.next`, `dist`, `docs`, `.git` 等をビルドコンテキストから除外します。

#### [NEW] [docker-compose.yml](file:///c:/Users/touho/.gemini/antigravity/scratch/abc_inventory_system/docker-compose.yml)
*   開発・テスト用に簡単にコンテナを立ち上げられる設定ファイルを作成します。ポート 3000 をホストに公開します。

## 確認計画
### 手動確認
1.  **イメージのビルド**: `docker build -t abc-inventory .` が正常に完了することを確認。
2.  **コンテナの起動**: `docker compose up -d` を実行し、コンテナがエラーなく起動することを確認。
3.  **ブラウザ確認**: `http://localhost:3000` にアクセスし、ダッシュボードが表示されることを確認。
