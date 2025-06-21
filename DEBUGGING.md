# デバッグガイド - プロンプト読み込み問題

## 問題の症状
- プロンプトが正しく読み込まれていない
- デフォルトプロンプトが使用されている
- 環境変数が反映されていない

## 原因
1. **環境変数の未設定**: Vercelに環境変数が設定されていない
2. **非同期初期化の問題**: PromptStorageの初期化が完了する前にプロンプトが要求される
3. **キャッシュの問題**: Vercelのビルドキャッシュにより古い設定が使用される

## 解決方法

### 1. 環境変数の設定確認

#### ローカル環境での確認
```bash
# 環境変数チェックスクリプトを実行
node scripts/check-env.js
```

#### Vercel CLIでの確認
```bash
# Vercel CLIでログイン
vercel login

# 環境変数の一覧表示
vercel env ls

# 環境変数の追加
vercel env add PROMPT_ASKA production
# プロンプトの内容を貼り付ける

# 他のプロンプトも同様に追加
vercel env add PROMPT_KUWATA production
vercel env add PROMPT_MISSION production
vercel env add PROMPT_OMAE production
vercel env add PROMPT_INSTAGRAM production
```

### 2. Vercelダッシュボードでの設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択
3. Settings → Environment Variables
4. 以下の変数を追加:
   - `PROMPT_ASKA`: ASKA風プロンプト
   - `PROMPT_KUWATA`: 桑田佳祐風プロンプト
   - `PROMPT_MISSION`: ミッションインポッシブル風プロンプト
   - `PROMPT_OMAE`: 大前研一風プロンプト
   - `PROMPT_INSTAGRAM`: Instagram用プロンプト

### 3. デプロイメントの再実行

環境変数を追加した後は、必ず再デプロイが必要です:

```bash
# 強制的に再デプロイ
vercel --force

# または、Vercelダッシュボードから「Redeploy」ボタンをクリック
```

### 4. ログの確認方法

#### Vercel CLIでのログ確認
```bash
# リアルタイムログの確認
vercel logs --follow

# 特定のファンクションのログ
vercel logs --source api/webhook

# エラーログのみ表示
vercel logs --error
```

#### Vercelダッシュボードでのログ確認
1. プロジェクトページの「Functions」タブをクリック
2. 対象のFunctionを選択
3. 「Logs」セクションでログを確認

#### 確認すべきログ
- `Loaded prompt from environment variable` - 環境変数からの読み込み成功
- `Getting prompt` - プロンプト取得時の詳細情報
- `Environment validation passed` - 環境変数の検証成功

### 5. トラブルシューティング

#### プロンプトが反映されない場合

1. **ブラウザキャッシュをクリア**
   - Chrome: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

2. **Vercelのキャッシュをクリア**
   ```bash
   vercel env rm PROMPT_ASKA production
   vercel env add PROMPT_ASKA production
   ```

3. **デプロイメントの確認**
   - Vercelダッシュボードで最新のデプロイメントIDを確認
   - 環境変数の変更が反映されているか確認

#### デバッグモードの有効化

環境変数に以下を追加してより詳細なログを出力:
```bash
vercel env add DEBUG true production
```

### 6. 正常動作の確認

1. **管理画面でプロンプトを確認**
   - https://your-domain.vercel.app/admin.html
   - ログイン後、各スタイルのプロンプトが表示されることを確認

2. **LINE Botでテスト**
   - 各スタイルを指定してメッセージを送信
   - 期待通りのスタイルで返答があることを確認

3. **APIエンドポイントで確認**
   ```bash
   # ヘルスチェック
   curl https://your-domain.vercel.app/api/health
   ```

### 7. よくある問題と解決策

| 問題 | 原因 | 解決策 |
|------|------|--------|
| プロンプトが空 | 環境変数が設定されていない | Vercelダッシュボードで環境変数を追加 |
| デフォルトプロンプトが使用される | 環境変数の名前が間違っている | `PROMPT_ASKA`のように正確な名前を使用 |
| 変更が反映されない | キャッシュの問題 | 再デプロイとブラウザキャッシュのクリア |
| エラーログが出ない | ログレベルの設定 | `DEBUG=true`を環境変数に追加 |

### 8. 連絡先

問題が解決しない場合は、以下の情報を含めて報告してください:
- エラーメッセージ
- Vercelのデプロイメントログ
- 実行した手順
- 環境変数チェックスクリプトの出力