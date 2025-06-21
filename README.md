# AI Social Media Tool - LINE Style Tweet Bot

LINEユーザーが送信したメッセージ（テキスト/画像）をもとに、著名人スタイルでツイート/インスタグラム投稿文を自動生成するAIチャットボット。

## 機能

- 🎨 **5つのスタイル**: ASKA風、桑田佳祐風、インフルエンサー風、大前研一風、インスタグラム投稿用
- 📝 **文字数制御**: 30%、50%、70%、100%の4段階
- 🖼️ **画像解析**: OpenAI Vision APIによる画像コンテンツ分析
- 🚦 **レート制限**: 利用制限と月間使用量管理
- 📊 **使用量追跡**: トークンと画像解析の使用量モニタリング
- 🔧 **Web管理画面**: ブラウザからプロンプトの編集が可能

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/ai-social-media-tool.git
cd ai-social-media-tool
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`を`.env`にコピーして、必要な情報を設定：

```bash
cp .env.example .env
```

必要な環境変数：
- `LINE_CHANNEL_SECRET`: LINE Developerコンソールから取得
- `LINE_CHANNEL_ACCESS_TOKEN`: LINE Developerコンソールから取得
- `OPENAI_API_KEY`: OpenAI Platformから取得
- `ADMIN_PASSWORD`: 管理画面のパスワード
- `JWT_SECRET`: JWT認証用のシークレットキー

### 4. LINE Webhook設定

1. LINE Developerコンソールでチャンネルを作成
2. Webhook URLを設定: `https://YOUR-PROJECT.vercel.app/api/webhook`
3. Webhookを有効化
4. 応答メッセージを無効化

## デプロイ

### Vercelへのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ実行

```bash
vercel --prod
```

## 使い方

### 管理画面

1. ブラウザで `https://YOUR-PROJECT.vercel.app/api/admin` にアクセス
2. 設定したADMIN_PASSWORDでログイン
3. 各スタイルのプロンプトを編集・保存

### テキストメッセージ

```
「ASKA風で恋愛について書いて」
「桑田風で30%で夏の思い出」
「インスタ用に今日のランチについて」
```

### 画像メッセージ

1. 画像をLINEで送信
2. スタイル選択ボタンが表示される
3. 好きなスタイルを選択
4. AIが画像に基づいたコメントを生成

## 開発

### ローカル実行

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### プロジェクト構造

```
line-style-tweet-bot/
├── api/
│   └── webhook.ts          # Vercel API エンドポイント
├── src/
│   ├── config/            # 設定定数
│   ├── handlers/          # LINEイベントハンドラー
│   ├── middleware/        # ミドルウェア（レート制限等）
│   ├── services/          # 外部サービス統合
│   ├── types/             # TypeScript型定義
│   └── utils/             # ユーティリティ関数
├── .env.example           # 環境変数テンプレート
├── package.json           # 依存関係
├── tsconfig.json          # TypeScript設定
└── vercel.json            # Vercel設定
```

## 制限事項

- 月間トークン制限: 100,000トークン
- 月間画像解析制限: 50枚
- 15分あたり50リクエストまで
- 画像解析は1時間あたり10回まで

## ライセンス

ISC

---

最終更新: 2025-06-21