# デプロイメント手順

## 事前準備

### 1. 必要なアカウント
- [ ] GitHub アカウント
- [ ] Vercel アカウント
- [ ] LINE Developer アカウント
- [ ] OpenAI Platform アカウント

### 2. API キーの取得

#### LINE Messaging API
1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. 新規チャネル作成（Messaging API）
3. チャネル基本設定から取得：
   - Channel Secret → `LINE_CHANNEL_SECRET`
   - Channel Access Token（発行） → `LINE_CHANNEL_ACCESS_TOKEN`

#### OpenAI API
1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. API Keys セクションで新規キー作成 → `OPENAI_API_KEY`

## GitHubへのプッシュ

```bash
# リポジトリの初期化
git init

# ファイルの追加
git add .

# 初回コミット
git commit -m "Initial commit: LINE Style Tweet Bot"

# GitHubでリポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/ai-social-media-tool.git
git branch -M main
git push -u origin main
```

## Vercelへのデプロイ

### 1. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. GitHubリポジトリ「ai-social-media-tool」をインポート
4. 「Import」をクリック

### 2. 環境変数の設定

Vercelのプロジェクト設定で以下の環境変数を追加：

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `LINE_CHANNEL_SECRET` | LINE Channel Secret | `abc123...` |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Access Token | `xyz789...` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-...` |
| `ADMIN_PASSWORD` | 管理画面パスワード | `MySecurePass123!` |
| `JWT_SECRET` | JWT署名用秘密鍵 | `random-secret-key` |

### 3. デプロイ実行

1. 「Deploy」ボタンをクリック
2. デプロイ完了を待つ（約1-2分）
3. 発行されたURLを確認（例: `https://ai-social-media-tool.vercel.app`）

## LINE Webhook設定

### 1. Webhook URLの設定

1. LINE Developers Console でチャネルを開く
2. Messaging API設定 → Webhook設定
3. Webhook URL: `https://YOUR-PROJECT.vercel.app/api/webhook`
4. 「検証」ボタンで接続確認

### 2. 機能の有効化

- [ ] Webhookの利用：ON
- [ ] 応答メッセージ：OFF
- [ ] あいさつメッセージ：任意

## 動作確認

### 1. LINE公式アカウントを友だち追加

QRコードまたはIDで友だち追加

### 2. テスト送信

```
テキスト例：
- 「ASKA風で今日の天気について」
- 「桑田風で30%で夏の思い出」
- 「インスタ用に美味しいランチ」

画像送信：
1. 画像を送信
2. スタイル選択ボタンが表示
3. 好きなスタイルを選択
```

### 3. 管理画面の確認

1. `https://YOUR-PROJECT.vercel.app/api/admin` にアクセス
2. 設定した `ADMIN_PASSWORD` でログイン
3. プロンプトの編集テスト

## トラブルシューティング

### Webhookが動作しない

1. Vercelのログを確認
2. 環境変数が正しく設定されているか確認
3. LINE署名検証エラーの場合は Channel Secret を再確認

### 管理画面にアクセスできない

1. `/api/admin` のパスが正しいか確認
2. CORS エラーの場合はブラウザのキャッシュをクリア

### OpenAI APIエラー

1. API キーの有効性を確認
2. 利用制限に達していないか確認
3. クレジットが残っているか確認

## 監視とメンテナンス

### ログの確認

Vercelダッシュボード → Functions → ログを確認

### 使用量の監視

- OpenAI使用量: OpenAI Platform で確認
- Vercel使用量: Vercel ダッシュボードで確認

### アップデート方法

```bash
# ローカルで変更
git add .
git commit -m "Update: 機能追加や修正内容"
git push origin main

# Vercelが自動的に再デプロイ
```

## セキュリティ推奨事項

1. **定期的なパスワード変更**
   - ADMIN_PASSWORD を3ヶ月ごとに更新

2. **APIキーのローテーション**
   - OpenAI API キーを定期的に再生成

3. **アクセスログの監視**
   - 不審なアクセスパターンをチェック

4. **バックアップ**
   - プロンプト設定を定期的にエクスポート